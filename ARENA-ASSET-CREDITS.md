# SSL Arena assets and rendering — 22 October 2026

The arena runs on the existing, self-hosted Three.js 0.186.1 WebGL renderer.
Unity's current web and rendering documentation was reviewed when selecting the
implementation. This release does not include Unity or claim literal “5D”.

## Current footballer — Innerscene / MakeHuman

- Original author/source: Innerscene, adapted from MakeHuman CC0 assets.
- Original: https://www.innerscene.com/tools/library/3d-parts/soccer-player-standing-3d-person-team-sports-f55b1b4f
- Public original download: https://www.innerscene.com/api/library/soccer-player-standing-3d-person-team-sports-f55b1b4f/download
- Original file: `professional-soccer-standing.glb`, static, textured soccer figure.
- License: CC0 1.0; source license notice in `assets/arena/innerscene-license.txt`.
- Original SHA256: `773cfa73bbcf659d7044934aaeacf1c3c9a49ae2955a51f56de7ad61ad1b6ffb`.
- The runtime uses `footballer-pro.glb`, an adaptation with a 23-bone anatomical rig,
  continuous limb weights, separate jersey/shorts/socks/boots/skin/hands, subdivided
  garment surfaces, hidden-body removal and resized embedded textures.
- Prepared model SHA256: `e950b018a2ad73810ed774d55568469fba5cb000083aa9d2dfcd69eb322b6298`.
- Reproduction: install Python numpy/scipy/Pillow, download the original and run
  `python scripts/assets/prepare-athlete.py original.glb footballer-pro.glb male-rig.glb` in the
  admin repository. No Unity, Mixamo or commercial-game files are distributed.
- Anatomical skin weights are transferred through the matching MakeHuman UV layout
  from the CC0 Innerscene male base rig, then mapped onto the 23-bone game rig.
  Reference: https://www.innerscene.com/tools/library/3d-parts/male-base-mesh-3d-person-rigged-a-pose-380e6d89
  The reference GLB is a processing input and is not shipped to players.
- Both athletes share the downloaded mesh/texture template. Each has an independent
  cloned skeleton, team kit and IK pose. Clothing is mesh geometry; skin is textured.

## Crowd and stadium

- `crowd-atlas.png`: original OpenAI ImageGen art, generated for this project.
  Eight photographed-style seated adults in a 4×2 transparent atlas; no real team
  identity or third-party logos. The exact asset metadata is `crowd-atlas.json`.
- The in-game crowd uses this atlas in one instanced draw, with randomized variants,
  brightness and restrained movement. Spectators are billboards; the stadium,
  pitch, footballers, seats, roof, goal, ball and play are real 3D geometry.
- Stadium architecture, seating bowl, cantilever roof, steel trusses, light panels,
  concourses and display are original code. Static geometry is merged by material.
- The previous `player-base.glb` remains available for old cached clients only.
  It is the CC0 Quaternius Universal Base Characters `Superhero_Male_FullBody`
  from https://quaternius.com/packs/universalbasecharacters.html via
  https://github.com/programasweights/avatar/blob/main/public/assets/character.glb.
  Original notice: `assets/arena/quaternius-license.txt`.

## ambientCG Grass007

- Author: ambientCG; https://ambientcg.com/view?id=Grass007
- License: CC0 1.0, notice in `assets/arena/ambientcg-license.txt`.
- Color, OpenGL normal and roughness maps, unmodified JPEG files, mirrored from
  https://github.com/Seyamalam/blood-league-kickoff/tree/main/public/assets/vendor/ambientcg/grass007
- Color SHA256: `6dd286ae898027012d9a773896607229e1802b4c13b0f4a4d47a05b01092a9c3`.
- OpenGL normal SHA256: `f686c7254441a74850002c2652a1688e5dd01eb289c50957820d0b80a395b852`.

Assets are self-hosted under `/assets/arena/`. No remote asset request, account,
analytics or new browser permission is required. These maps support PBR grass;
ACES tone mapping, environment reflections, soft shadows and modest bloom are
implemented with Three.js. An HDR multisample render target smooths edges. Bloom is reduced first on a slow device; rendering resolution has a higher floor and shadows remain enabled.
The rig's wrist and ankle poses follow the recorded physical goalkeeper pose.

## Competition

League mode reads the current organizer's A/B membership and the published six
round group calendar, resetting results for the visitor's game. Each club plays
three same-group rivals home and away. The top two qualify: A1–B2 and A2–B1,
then final and third-place match. Knockouts use paired sudden-death kicks.
Group ranking follows points, goal difference, goals scored, goals conceded,
wins and then the tied clubs' head-to-head mini-table. There are no cards in the
penalty game, so fair-play values are equal. A seeded draw resolves a remaining
exact tie. Saves validate current groups and schedule and reject old seven-round
campaigns. All game results are local to the visitor's device.

## Rendering references

- https://docs.unity3d.com/6000.0/Documentation/Manual/choose-a-render-pipeline.html
- https://docs.unity3d.com/6000.0/Documentation/Manual/webgl-technical-overview.html
- https://threejs.org/docs/pages/SkinnedMesh.html
- https://threejs.org/docs/pages/MeshPhysicalMaterial.html
- https://threejs.org/examples/
