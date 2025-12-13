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
            pname = "simple-diff";
            version = "0.1.0";

            src = ./.;

            bunDeps = pkgs.bun2nix.fetchBunDeps {
              bunNix = ./bun.nix;
            };

            # bunInstallFlags = [
            # "--linker=isolated"
            # "--backend=copyfile"
            # ];

            nativeBuildInputs = with pkgs; [
              makeWrapper
              bun
            ];

            buildPhase = ''
              runHook preBuild
              bun run ./bundle.ts
              runHook postBuild
            '';

            installPhase = ''
              runHook preInstall
              mkdir -p $out/lib/simple-diff $out/bin

              cp -r dist node_modules $out/lib/simple-diff

              makeWrapper ${pkgs.bun}/bin/bun $out/bin/simple-diff \
                --add-flags "run" \
                --add-flags "$out/lib/simple-diff/dist/index.js" \
                --argv0 simple-diff

              runHook postInstall
            '';

            meta = {
              description = "A simple diff tool";
              mainProgram = "simple-diff";
            };
          };
        }
      );

      devShells = eachSystem (system: {
        default = pkgsFor.${system}.mkShell {
          packages = with pkgsFor.${system}; [
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
