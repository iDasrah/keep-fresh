export interface Unit {
    label: string;
    value: string;
}

export const units: Unit[] = [
    { label: 'pc', value: 'pc' },
    { label: 'pcs', value: 'pcs' },
    { label: 'piece', value: 'piece' },
    { label: 'pieces', value: 'pieces' },
    { label: 'unit', value: 'unit' },
    { label: 'units', value: 'units' },

    { label: 'mg', value: 'mg' },
    { label: 'g', value: 'g' },
    { label: 'kg', value: 'kg' },
    { label: 'ton', value: 'ton' },

    { label: 'oz', value: 'oz' },
    { label: 'lb', value: 'lb' },
    { label: 'lbs', value: 'lbs' },

    { label: 'ml', value: 'ml' },
    { label: 'cl', value: 'cl' },
    { label: 'dl', value: 'dl' },
    { label: 'L', value: 'L' },
    { label: 'l', value: 'l' },
    { label: 'liter', value: 'liter' },
    { label: 'litre', value: 'litre' },

    { label: 'fl oz', value: 'fl oz' },
    { label: 'cup', value: 'cup' },
    { label: 'cups', value: 'cups' },
    { label: 'pint', value: 'pint' },
    { label: 'pints', value: 'pints' },
    { label: 'quart', value: 'quart' },
    { label: 'quarts', value: 'quarts' },
    { label: 'gallon', value: 'gallon' },
    { label: 'gallons', value: 'gallons' },

    { label: 'tsp', value: 'tsp' },
    { label: 'teaspoon', value: 'teaspoon' },
    { label: 'tbsp', value: 'tbsp' },
    { label: 'tablespoon', value: 'tablespoon' },

    { label: 'box', value: 'box' },
    { label: 'boxes', value: 'boxes' },
    { label: 'bag', value: 'bag' },
    { label: 'bags', value: 'bags' },
    { label: 'bottle', value: 'bottle' },
    { label: 'bottles', value: 'bottles' },
    { label: 'can', value: 'can' },
    { label: 'cans', value: 'cans' },
    { label: 'jar', value: 'jar' },
    { label: 'jars', value: 'jars' },
    { label: 'pack', value: 'pack' },
    { label: 'packs', value: 'packs' },
    { label: 'package', value: 'package' },
    { label: 'packages', value: 'packages' },
    { label: 'container', value: 'container' },
    { label: 'containers', value: 'containers' },
    { label: 'carton', value: 'carton' },
    { label: 'cartons', value: 'cartons' },
    { label: 'tube', value: 'tube' },
    { label: 'tubes', value: 'tubes' },
    { label: 'sachet', value: 'sachet' },
    { label: 'sachets', value: 'sachets' },
    { label: 'pouch', value: 'pouch' },
    { label: 'pouches', value: 'pouches' },
    { label: 'bunch', value: 'bunch' },
    { label: 'bunches', value: 'bunches' },
    { label: 'bundle', value: 'bundle' },
    { label: 'bundles', value: 'bundles' },
    { label: 'tray', value: 'tray' },
    { label: 'trays', value: 'trays' },
];

export const getQuantityOptionsForUnit = (unitValue: string) => {
    const weightUnits = ['mg', 'g', 'kg', 'ton', 'oz', 'lb', 'lbs'];
    const volumeUnits = ['ml', 'cl', 'dl', 'L', 'l', 'liter', 'litre', 'fl oz'];
    const cookingUnits = ['tsp', 'teaspoon', 'tbsp', 'tablespoon', 'cup', 'cups'];
    const largeVolumeUnits = ['pint', 'pints', 'quart', 'quarts', 'gallon', 'gallons'];
    const countUnits = ['pc', 'pcs', 'piece', 'pieces', 'unit', 'units'];
    const packageUnits = ['box', 'boxes', 'bag', 'bags', 'bottle', 'bottles', 'can', 'cans',
        'jar', 'jars', 'pack', 'packs', 'package', 'packages', 'container',
        'containers', 'carton', 'cartons', 'tube', 'tubes', 'sachet', 'sachets',
        'pouch', 'pouches', 'bunch', 'bunches', 'bundle', 'bundles', 'tray', 'trays'];

    if (weightUnits.includes(unitValue)) {
        if (unitValue === 'mg') {
            // mg: 50, 100, 150, 200... 500, 100, 200, 300... 1000
            return [
                ...Array.from({length: 10}, (_, i) => ({ label: ((i + 1) * 50).toString(), value: ((i + 1) * 50).toString() })),
                ...Array.from({length: 5}, (_, i) => ({ label: ((i + 6) * 100).toString(), value: ((i + 6) * 100).toString() })),
            ];
        } else if (unitValue === 'g') {
            // g: 1-20, 50, 100, 150... 1000
            return [
                ...Array.from({length: 20}, (_, i) => ({ label: (i + 1).toString(), value: (i + 1).toString() })),
                ...Array.from({length: 20}, (_, i) => ({ label: ((i + 2) * 25).toString(), value: ((i + 2) * 25).toString() })),
            ];
        } else if (unitValue === 'kg' || unitValue === 'lb' || unitValue === 'lbs') {
            // kg/lb: 0.1, 0.25, 0.5, 0.75, 1-20, 25, 30, 40, 50
            return [
                { label: '0.1', value: '0.1' },
                { label: '0.25', value: '0.25' },
                { label: '0.5', value: '0.5' },
                { label: '0.75', value: '0.75' },
                ...Array.from({length: 20}, (_, i) => ({ label: (i + 1).toString(), value: (i + 1).toString() })),
                { label: '25', value: '25' },
                { label: '30', value: '30' },
                { label: '40', value: '40' },
                { label: '50', value: '50' },
            ];
        } else if (unitValue === 'oz') {
            // oz: 1-32
            return Array.from({length: 32}, (_, i) => ({ label: (i + 1).toString(), value: (i + 1).toString() }));
        }
    }

    if (volumeUnits.includes(unitValue)) {
        if (unitValue === 'ml') {
            // ml: 10, 25, 50, 75, 100, 150, 200, 250...
            return [
                { label: '10', value: '10' },
                { label: '25', value: '25' },
                { label: '50', value: '50' },
                { label: '75', value: '75' },
                ...Array.from({length: 19}, (_, i) => ({ label: ((i + 2) * 50).toString(), value: ((i + 2) * 50).toString() })),
            ];
        } else if (unitValue === 'cl') {
            // cl: 1-100
            return Array.from({length: 100}, (_, i) => ({ label: (i + 1).toString(), value: (i + 1).toString() }));
        } else if (unitValue === 'L' || unitValue === 'l' || unitValue === 'liter' || unitValue === 'litre') {
            // L: 0.1, 0.25, 0.5, 0.75, 1-10, 15, 20, 25, 30
            return [
                { label: '0.1', value: '0.1' },
                { label: '0.25', value: '0.25' },
                { label: '0.5', value: '0.5' },
                { label: '0.75', value: '0.75' },
                ...Array.from({length: 10}, (_, i) => ({ label: (i + 1).toString(), value: (i + 1).toString() })),
                { label: '15', value: '15' },
                { label: '20', value: '20' },
                { label: '25', value: '25' },
                { label: '30', value: '30' },
            ];
        } else if (unitValue === 'fl oz') {
            // fl oz: 1-64
            return Array.from({length: 64}, (_, i) => ({ label: (i + 1).toString(), value: (i + 1).toString() }));
        }
    }

    if (cookingUnits.includes(unitValue)) {
        if (unitValue === 'tsp' || unitValue === 'teaspoon') {
            // tsp: 0.25, 0.5, 0.75, 1-10
            return [
                { label: '1/4', value: '0.25' },
                { label: '1/2', value: '0.5' },
                { label: '3/4', value: '0.75' },
                ...Array.from({length: 10}, (_, i) => ({ label: (i + 1).toString(), value: (i + 1).toString() })),
            ];
        } else if (unitValue === 'tbsp' || unitValue === 'tablespoon') {
            // tbsp: 0.5, 1-15
            return [
                { label: '1/2', value: '0.5' },
                ...Array.from({length: 15}, (_, i) => ({ label: (i + 1).toString(), value: (i + 1).toString() })),
            ];
        } else if (unitValue === 'cup' || unitValue === 'cups') {
            // cups: 0.25, 0.33, 0.5, 0.66, 0.75, 1-12
            return [
                { label: '1/4', value: '0.25' },
                { label: '1/3', value: '0.33' },
                { label: '1/2', value: '0.5' },
                { label: '2/3', value: '0.66' },
                { label: '3/4', value: '0.75' },
                ...Array.from({length: 12}, (_, i) => ({ label: (i + 1).toString(), value: (i + 1).toString() })),
            ];
        }
    }

    if (largeVolumeUnits.includes(unitValue)) {
        return Array.from({length: 20}, (_, i) => ({ label: (i + 1).toString(), value: (i + 1).toString() }));
    }

    if (countUnits.includes(unitValue) || packageUnits.includes(unitValue)) {
        return Array.from({length: 50}, (_, i) => ({ label: (i + 1).toString(), value: (i + 1).toString() }));
    }

    return Array.from({length: 100}, (_, i) => ({ label: (i + 1).toString(), value: (i + 1).toString() }));
};