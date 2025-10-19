# Keep Fresh

---

Utilisation de Ngrok pour le développement local avec l'API distante.
---

## Prérequis
- Avoir Ngrok installé. Vous pouvez le télécharger depuis [ngrok.com](https://ngrok.com/).
- Cloner le dépôt de l'API distante [keep-fresh-api](https://github.com/luci1s/keep-fresh-api).

## Étapes

1. Lancer l'API distante en local :
```sh
npm run start:dev
```

2. Ouvrir un terminal séparé et lancer Ngrok pour créer un tunnel vers le port 8000 :
```sh
ngrok http 8000
```

3. Copier l'URL HTTPS fournie par Ngrok.
4. Mettre à jour la variable d'environnement `EXPO_PUBLIC_API_URL` dans le fichier `.env` de keep-fresh-app :
```
EXPO_PUBLIC_API_URL="LIEN_HTTPS_NGROK"
```