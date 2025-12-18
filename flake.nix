{
  description = "A simple diff tool";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    systems.url = "github:nix-systems/default";
    bun2nix = {
      url = "github:nix-community/bun2nix?tag=2.0.6";
      inputs.nixpkgs.follows = "nixpkgs";
      inputs.systems.follows = "systems";
    };
  };

  nixConfig = {
    extra-substituters = [
      "https://cache.nixos.org"
      "https://nix-community.cachix.org"
    ];
    extra-trusted-public-keys = [
      "cache.nixos.org-1:6NCHdD59X431o0gWypbMrAURkbJ16ZPMQFGspcDShjY="
      "nix-community.cachix.org-1:mB9FSh9qf2dCimDSUo8Zy7bkq5CX+/rkCWyvRCYg3Fs="
    ];
  };

  outputs =
    inputs:
    let
      eachSystem = inputs.nixpkgs.lib.genAttrs (import inputs.systems);

      pkgsFor = eachSystem (
        system:
        import inputs.nixpkgs {
          inherit system;
          overlays = [ inputs.bun2nix.overlays.default ];
        }
      );
    in
    {
      packages = eachSystem (
        system:
        let
          pkgs = pkgsFor.${system};
        in
        {
          default = pkgs.bun2nix.mkDerivation {
            pname = "difftui";
            packageJson = ./package.json;
            src = ./.;

            bunDeps = pkgs.bun2nix.fetchBunDeps {
              bunNix = ./bun.nix;
            };

            # bunInstallFlags = [
            # "--linker=isolated"
            # "--backend=copyfile"
            # ];

            nativeBuildInputs = with pkgs; [
              bun
            ];

            buildPhase = ''
              runHook preBuild
              bun run ./bundle.ts --compile
              bun build ./dist/index.js --compile --outfile difftui
              runHook postBuild
            '';

            dontStrip = true;

            installPhase = ''
              runHook preInstall
              mkdir -p $out/bin
              cp difftui $out/bin/
              runHook postInstall
            '';

            meta = {
              description = "A simple diff tool";
              mainProgram = "difftui";
            };
          };
        }
      );

      devShells = eachSystem (system: {
        default = pkgsFor.${system}.mkShell {
          packages = with pkgsFor.${system}; [
            biome
            bun
            bun2nix
          ];

          shellHook = ''
            bun install --frozen-lockfile
          '';
        };
      });
    };
}
