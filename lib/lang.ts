const fr = {
    tab: {
        index: "Frigos",
        stats: "Stats",
        settings: "Paramètres",
    },
    header: {
        searchbar: {
            placeholder: {
                all: "Rechercher dans tous les frigos...",
                fridge: "Rechercher dans le frigo...",
                freezer: "Rechercher dans le congélateur...",
                pantry: "Rechercher dans le garde-manger...",
            }
        },
        storageSelector: {
            all: "Tous",
            fridge: "Frigo",
            freezer: "Congélateur",
            pantry: "Placards",
        }
    },
    product: {
        expiringIn: "Expire dans",
    },
    addItem: {
        title: "Ajouter un nouvel article",
        subtitle: "Ajoutez rapidement un produit à votre frigo.",
        form: {
            name: {
                label: "Nom du produit",
                placeholder: "Ex: Yaourt nature",
            },
            quantity: {
                label: "Quantité",
                placeholder: "Ex: 6",
            },
            unit: {
                label: "Unité",
                placeholder: "Ex: pièces, g, ml...",
            },
            storage: {
                label: "Stockage",
            },
            expirationDate: {
                label: "Date d'expiration",
                placeholder: "Sélectionner une date",
            },
            addButton: "Ajouter l'article",
        }
    },
    notifications: {
        itemExpired: {
            title: "Article expiré",
            body: (itemName: string) => `L'article ${itemName} a expiré aujourd'hui.`,
        },
        itemExpiringSoon: {
            title: "Article bientôt expiré",
            body: (itemName: string, days: number) => `L'article ${itemName} expirera dans ${days} jours.`,
        }
    }
}

const lang = fr;

export default lang;