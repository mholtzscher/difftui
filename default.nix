{
  bun2nix,
  pkgs,
}:
bun2nix.mkDerivation {
  pname = "simple-diff";
  version = "0.1.0";

  src = ./.;

  bunDeps = bun2nix.fetchBunDeps {
    bunNix = ./bun.nix;
  };

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
}
