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
                pantry: "Rechercher dans les placards...",
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
    },
    alert: {
        cancel: "Annuler",
        deleteItem: "Supprimer l'article",
        deleteItemMessage: "Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.",
        throw: "Jeter",
        consume: "Consommer",
        deleteData: {
            title: "Supprimer mes données",
            message: "Êtes-vous sûr de vouloir supprimer toutes vos données ? Cette action est irréversible.",
            delete: "Supprimer",
        }
    },
    stats: {
        antiWasteTitle: "Score Anti-Gaspi",
        antiWasteMessages: {
            low: [
                {
                    title: "Trop de gaspillage ! 😢",
                    content: "Beaucoup de produits ont expiré ce mois-ci."
                },
                {
                    title: "Action requise ! 🚨",
                    content: "Active les notifications pour ne rien manquer."
                },
                {
                    title: "C'est le moment d'agir ! 💡",
                    content: "Planifie mieux tes repas pour moins jeter."
                }
            ],
            medium: [
                {
                    title: "Attention ⚠️",
                    content: "Quelques produits ont été jetés ce mois-ci."
                },
                {
                    title: "On peut mieux faire 💪",
                    content: "Pense à vérifier les dates régulièrement."
                },
                {
                    title: "Pas mal ! 👍",
                    content: "Mais il y a encore de la marge de progression."
                }
            ],
            high: [
                {
                    title: "Excellent ! 🌟",
                    content: "Continue comme ça, tu gaspilles très peu !"
                },
                {
                    title: "Bravo ! 👏",
                    content: "Ton frigo est bien géré, zéro déchet !"
                },
                {
                    title: "Top ! 💚",
                    content: "Tu es un champion anti-gaspi !"
                }
            ],
        }
    },
    settings: {
        notifications: {
            title: "Notifications",
            expiredProduct: {
                title: "Produit expiré",
                description: "Recevoir une notification le jour où un produit expire."
            },
            expiringSoonProduct: {
                title: "Produit bientôt expiré",
                description: "Recevoir une notification quelques jours avant qu'un produit n'expire."
            },
        },
        feedback: {
            title: "Envoyer un commentaire",
        },
        deleteData: {
            title: "Supprimer mes données",
        }
    }
}

const lang = fr;

export default lang;