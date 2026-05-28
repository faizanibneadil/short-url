import { Block } from "payload";

export const RotateText: Block = {
    slug: 'rotate_text',
    interfaceName: 'RotateTextPropsType',
    fields: [{
        type: 'text',
        name: 'texts',
        required: true,
        hasMany: true
    }, {
        type: 'textarea',
        name: 'main_class_name',
        defaultValue: "px-2 sm:px-2 md:px-3 bg-cyan-300 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
    }, {
        type: 'row',
        fields: [{
            type: 'select',
            name: 'stagger_from',
            defaultValue: 'first',
            options: [{
                label: 'First',
                value: 'first'
            }, {
                label: 'Last',
                value: 'last'
            }, {
                label: 'Center',
                value: 'center',
            }, {
                label: 'Random',
                value: 'random'
            }, {
                label: 'Number',
                value: 'number'
            }]
        }, {
            type: 'number',
            name: 'stagger_from_value_in_number',
            admin: {
                condition: (_, { stagger_from }) => stagger_from === 'number'
            }
        }, {
            type: 'number',
            name: 'stagger_duration',
            defaultValue: 0.025
        }, {
            type: 'textarea',
            name: 'split_level_class_name',
            defaultValue: 'overflow-hidden pb-0.5 sm:pb-1 md:pb-1'
        }, {
            type: 'number',
            name: 'rotation_interval',
            defaultValue: 2000
        }, {
            type: 'select',
            name: 'split_by',
            defaultValue: 'characters',
            options: [{
                label: 'characters',
                value: 'characters'
            }]
        }, {
            type: 'row',
            fields: [{
                type: 'checkbox',
                name: 'enable_auto',
                defaultValue: true
            }, {
                type: 'checkbox',
                name: 'enable_loop',
                defaultValue: true
            }]
        }]
    }]
}