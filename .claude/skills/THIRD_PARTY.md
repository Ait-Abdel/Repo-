# Skills tiers

Copiés tels quels depuis leurs dépôts publics, figés à la version vérifiée. Pour mettre à jour : recopier le dossier depuis la source et relire le diff.

| Dossier | Source | Commit | Licence |
|---|---|---|---|
| `web-design-guidelines/` | vercel-labs/agent-skills, `skills/web-design-guidelines` | 5a37a6329fbad3666c3207392a6a7c0110e92efb | MIT |
| `shadcn/` | shadcn-ui/ui, `skills/shadcn` | 0e5b2e621a9ee4cf6a604bbe6c5c0d5b70561eb4 | MIT |
| `accessibility/` | addyosmani/web-quality-skills, `skills/accessibility` | afa8da942115f2961fdbfa80807ea0b232ff6c00 | MIT |

Le plugin `ui-ux-pro-max` est déclaré dans `.claude/settings.json` (marketplace nextlevelbuilder/ui-ux-pro-max-skill, figé sur 11ca2b3bdd555649f278ee348c32a9302b24dcf1).

Note : le skill `shadcn` exécute `npx shadcn@latest info --json` quand il se charge, et pré-autorise les commandes `npx shadcn@latest …`.
