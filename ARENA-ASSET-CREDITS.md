# SSL Arena assets and rendering — 22 October 2026

The arena runs on the existing, self-hosted Three.js 0.186.1 WebGL renderer.
Unity's current web and rendering documentation was reviewed when selecting the
implementation. This release does not include Unity or claim literal “5D”.

## Quaternius humanoid base

- Author: Quaternius; pack: Universal Base Characters, free Standard edition.
- Original: https://quaternius.com/packs/universalbasecharacters.html
- Download and license: https://quaternius.itch.io/universal-base-characters
- Model: `Superhero_Male_FullBody` (13k triangles, 65-bone humanoid rig).
- License: CC0 1.0, original notice in `assets/arena/quaternius-license.txt`.
- Public redistribution used: https://github.com/programasweights/avatar/blob/main/public/assets/character.glb
- Verified Git blob: `b3fd79533fdb9fcedd077744f7e120920eb6cc97` (741320 bytes).
- Only the CC0 base mesh, skin weights, normals and skeleton are used. Original
  images are absent. Jersey materials, club markings, IK poses and all gameplay
  animation are implemented in this repository. No third-party app code or
  Mixamo animations were copied.

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
implemented with Three.js. Rendering resolution and bloom adapt to the device.
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
