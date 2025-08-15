# PhytoMarker-DB Frontend 🧬

Bienvenue sur le dépôt du front-end de **PhytoMarker-DB**. Cette application, développée avec **Angular**, fournit l'interface utilisateur pour la plateforme d'analyse génétique végétale. Elle a pour mission de remplacer les fichiers Excel épars par une plateforme web unifiée, ergonomique et performante pour centraliser et analyser des données génétiques (phénotypes, génotypes, pedigrees).

Ce dépôt contient uniquement le code de l'application cliente. Le code du backend (API Spring Boot) se trouve dans le dépôt [phytomarker-db-back](https://github.com/PhytoMarker-DB/phytomarker-db-back).

## ✨ Fonctionnalités Principales

*   **Recherche Avancée :** Filtrez les données végétales selon de multiples critères (variété, score de résistance, présence de marqueurs génétiques).
*   **Visualisation des Données :** Affichez les résultats de recherche dans un tableau clair et interactif.
*   **Analyses Statistiques :** Générez et visualisez dynamiquement des statistiques sur les cohortes de résultats (distribution des scores, fréquence des marqueurs).
*   **Fiche Détail Complète :** Consultez une vue à 360° de chaque plante, incluant ses informations de base, ses marqueurs, et ses observations phénotypiques.
*   **Visualisation de Pedigree Interactive :** Affichez l'arbre généalogique complet d'une plante. Le graphique gère les relations multi-parents, le zoom, le panoramique et le glisser-déposer pour une exploration intuitive.
*   **Saisie de Données :** Un formulaire de saisie dédié permet d'ajouter de nouvelles plantes à la base de données avec une validation en temps réel.
*   **Export de Données :** Exportez les résultats de n'importe quelle recherche au format CSV en un seul clic.

## 🛠️ Stack Technique

*   **Framework :** [Angular](https://angular.io/) v15+ (avec composants Standalone)
*   **Langage :** [TypeScript](https://www.typescriptlang.org/)
*   **Visualisation de Données :**
    *   [D3.js](https://d3js.org/) pour le graphique de pedigree personnalisé.
    *   [Ngx-charts](https://swimlane.github.io/ngx-charts/) pour les graphiques statistiques (box plots, diagrammes à barres).
*   **Styling :** SCSS avec des variables CSS pour un theming facile.
*   **Client HTTP :** `HttpClient` d'Angular.

## 🚀 Démarrage Rapide

Pour lancer l'application en local, suivez ces étapes.

### Prérequis

Assurez-vous d'avoir les outils suivants installés sur votre machine :
*   [Node.js](https://nodejs.org/) (version 18.x ou supérieure recommandée)
*   [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)
*   [Git](https://git-scm.com/)

### Installation

1.  **Clonez le dépôt :**
    ```bash
    git clone https://github.com/PhytoMarker-DB/phytomarker-db-front.git
    cd phytomarker-db-front
    ```

2.  **Installez les dépendances :**
    ```bash
    npm install
    ```

### Lancement

1.  **❗️ Important :** Assurez-vous que le [serveur backend](https://github.com/PhytoMarker-DB/phytomarker-db-back) est lancé et accessible. Par défaut, le front-end essaiera de le contacter sur `http://localhost:8080`.

2.  **Lancez le serveur de développement Angular :**
    ```bash
    ng serve
    ```

3.  **Ouvrez l'application :**
    Naviguez sur `http://localhost:4200/` dans votre navigateur. L'application se rechargera automatiquement si vous modifiez les fichiers source.

## 🔌 Configuration de l'API

La connexion au backend est configurée dans un seul fichier pour une maintenance facile.

*   **Fichier :** `src/app/services/plant.service.ts`
*   **Ligne à modifier :**
    ```typescript
    private apiUrl = 'http://localhost:8080/api';
    ```
Si votre backend tourne sur un autre port ou une autre machine, modifiez cette URL en conséquence.

## 📁 Structure du Projet

Le projet suit la structure standard d'une application Angular, avec une organisation axée sur les fonctionnalités.

```
src/app/
├── component/                # Composants réutilisables (graphiques, etc.)
│   ├── pedigree-chart/
│   └── statistical-charts/
├── models/                   # Interfaces et modèles de données TypeScript
│   ├── plant.model.ts
│   └── ...
├── pages/                    # Composants "intelligents" correspondant aux routes de l'app
│   ├── data-entry-page/
│   ├── plant-detail-page/
│   └── search-page/
├── services/                 # Services pour la logique métier et les appels API
│   └── plant.service.ts
├── app.component.*           # Composant racine
├── app.config.ts             # Configuration de l'application (providers, etc.)
└── app.routes.ts             # Définition des routes de l'application
```

## 📦 Build pour la Production

Pour créer une version optimisée de l'application prête pour le déploiement, exécutez la commande suivante :

```bash
ng build
```

Les fichiers compilés seront générés dans le dossier `dist/phytomarker-db-front/`. Vous pouvez ensuite déployer le contenu de ce dossier sur n'importe quel serveur web statique.

---
