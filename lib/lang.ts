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
                placeholder: {
                    fridge: [
                        "Ex: Yaourt nature",
                        "Ex: Fromage râpé",
                        "Ex: Jus d’orange",
                        "Ex: Poulet rôti",
                        "Ex: Lait demi-écrémé",
                    ],
                    freezer: [
                        "Ex: Poisson pané",
                        "Ex: Glace vanille",
                        "Ex: Légumes surgelés",
                        "Ex: Pizza",
                        "Ex: Steaks hachés",
                    ],
                    pantry: [
                        "Ex: Pâtes",
                        "Ex: Riz basmati",
                        "Ex: Biscuits",
                        "Ex: Sauce tomate",
                        "Ex: Huile d’olive",
                    ],
                },
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
        },
        avgConsumptionTime: {
            title: "jours",
            subtitle: {
                short: [
                    "Ils ne font pas long feu.",
                    "Rapides comme l’éclair.",
                    "À peine stockés, déjà savourés.",
                    "Pas le temps de s’installer.",
                    "Ils passent en coup de vent.",
                    "Toujours frais, jamais oubliés.",
                    "Flash food.",
                    "Ton frigo vit à 100 à l’heure."
                ],
                medium: [
                    "Le bon tempo.",
                    "Juste ce qu’il faut.",
                    "Ils attendent sagement.",
                    "Ni trop tôt, ni trop tard.",
                    "À point pour être savourés.",
                    "Un rythme bien rodé.",
                    "Ils trouvent leur moment."
                ],
                long: [
                    "Ils prennent leur temps.",
                    "Ils hibernent un peu.",
                    "Patience avant dégustation.",
                    "Ils attendent leur heure.",
                    "Ils se reposent au frais.",
                    "Ils vivent une longue vie.",
                    "Les repas prennent le large.",
                    "C’est presque un garde-manger éternel."
                ]
            }
        },
        expiredThisWeek: {
            title: "produits expirés cette semaine",
            subtitle: {
                none: [
                    "Rien n’a été perdu, tout est sauvé.",
                    "Zéro perte, c’est du grand art.",
                    "Tu gères comme un chef.",
                    "Pas une miette de gâchée.",
                    "Mission anti-gaspi accomplie."
                ],
                few: [
                    "Ils n’ont pas tenu… mais toi si.",
                    "Un petit oubli, ça arrive.",
                    "Presque un sans faute.",
                    "Juste un faux pas.",
                    "Une perte minime, une leçon de plus."
                ],
                some: [
                    "Ils sont tombés au combat.",
                    "Un peu de gâchis cette semaine.",
                    "On peut faire mieux, on le sait.",
                    "Ils t’ont échappé de peu.",
                    "Pas parfait, mais t’es sur la bonne voie."
                ],
                many: [
                    "Ton frigo mérite un coup d’œil.",
                    "Ils t’ont filé entre les doigts.",
                    "Une semaine difficile.",
                    "Gros dégât, mais rien d’irréversible.",
                    "Le gaspillage a gagné cette manche."
                ]
            }
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
    },
    noItems: {
        title: "Vous n'avez ajouté aucun article !",
        button: "Ajouter un article",
    }
}

const lang = fr;

export default lang;