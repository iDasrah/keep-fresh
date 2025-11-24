# Keep Fresh

Application mobile de gestion de frigo pour réduire le gaspillage alimentaire

## À propos

Keep Fresh est une application mobile qui vous aide à gérer votre frigo, congélateur et placard en vous notifiant avant l'expiration de vos produits.

Fini les yaourts oubliés et les légumes périmés !

## Fonctionnalités

- **Gestion des produits** : Ajoutez vos aliments avec leur date d'expiration
- **Notifications intelligentes** : Recevez des alertes avant que vos produits n'expirent
- **Score anti-gaspi** : Suivez vos progrès avec un score de 0 à 100
- **Statistiques** : Visualisez votre temps moyen de consommation et vos produits expirés
- **Liste de courses** : Gérez vos courses directement dans l'app
- **Organisation** : Triez par type de stockage (frigo, congélateur, placard)

## Technologies

- React Native / Expo

## Développement local avec l'API

### Méthode 1

#### Prérequis
- Cloner le dépôt de l'API : [keep-fresh-api](https://github.com/luci1s/keep-fresh-api)

#### Configuration

1. **Lancer l'API en local** :
```sh
cd keep-fresh-api
npm run start:dev
```

2. **Récupérer l'IP locale** :
```sh
ipconfig # Windows
ipconfig getifaddr en0 # Mac Wi-Fi
ipconfig getifaddr en1 # Mac Ethernet
ifconfig # Linux
```

3. **Configurer l'URL de l'API** :
   - Créer un fichier `.env` dans keep-fresh-app
   - Ajouter la variable :
```env
EXPO_PUBLIC_API_URL="https://votre-ip-locale:8000"
```

4. **Générer le client de l'API** :
```sh
npm run openapi
```

5. **Lancer l'app mobile** :
```sh
npx expo start
```

### Méthode 2

#### Prérequis
- Avoir Ngrok installé ([ngrok.com](https://ngrok.com/))
- Cloner le dépôt de l'API : [keep-fresh-api](https://github.com/luci1s/keep-fresh-api)

#### Configuration

1. **Lancer l'API en local** :
```sh
cd keep-fresh-api
npm run start:dev
```

2. **Créer un tunnel Ngrok** (terminal séparé) :
```sh
ngrok http 8000
```

3. **Configurer l'URL de l'API** :
   - Copier l'URL HTTPS fournie par Ngrok
   - Créer un fichier `.env` dans keep-fresh-app
   - Ajouter la variable :
```env
EXPO_PUBLIC_API_URL="https://votre-url-ngrok.ngrok-free.app"
```

4. **Générer le client de l'API** :
```sh
npm run openapi
```

5. **Lancer l'app mobile** :
```sh
npx expo start --tunnel
```

## Roadmap

- [ ] Storages personnalisés
- [ ] Partage entre utilisateurs (famille, coloc)
- [ ] Synchronisation multi-device
- [x] Scanner de codes-barres
- [ ] Suggestions de recettes (IA)
- [ ] Stats avancées avec graphiques

## Équipe

- **[Mathéo Picouleau](https://github.com/iDasrah)**
- **[Lucien Schwob](https://github.com/luci1s)**

**Statut :** En développement