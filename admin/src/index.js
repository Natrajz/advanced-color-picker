import { prefixPluginTranslations } from '@strapi/helper-plugin';
import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import Initializer from './components/Initializer';
import PluginIcon from './components/PluginIcon';
import getTrad from './utils/getTrad';

const name = pluginPkg.strapi.name;

export default {
  register(app) {
    // app.addMenuLink({
    //   to: `/plugins/${pluginId}`,
    //   icon: PluginIcon,
    //   intlLabel: {
    //     id: `${pluginId}.plugin.name`,
    //     defaultMessage: name,
    //   },
    //   Component: async () => {
    //     const component = await import('./pages/App');

    //     return component;
    //   },
    //   permissions: [
    //     // Uncomment to set the permissions of the plugin here
    //     // {
    //     //   action: '', // the action name should be plugin::plugin-name.actionType
    //     //   subject: null,
    //     // },
    //   ],
    // });
    // app.registerPlugin({
    //   id: pluginId,
    //   initializer: Initializer,
    //   isReady: false,
    //   name,
    // });

    app.customFields.register({
      name: "advanced-color-picker",
      pluginId: "advanced-color-picker", 
      type: "string", 
      intlLabel: {
        id: "color-picker.label",
        defaultMessage: "Color Picker",
      },
      intlDescription: {
        id: "color-picker.description",
        defaultMessage: "Pick your color both the solid and gradient",
      },
      icon: PluginIcon,
      components: {
        Input: async () => import("./components/Input"),
      },
      options: {
        advanced: [
          {
            intlLabel: {
              id: getTrad('color-picker.options.advanced.regex'),
              defaultMessage: 'RegExp pattern',
            },
            name: 'regex',
            type: 'text',
            defaultValue: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
            description: {
              id: getTrad('color-picker.options.advanced.regex.description'),
              defaultMessage: 'The text of the regular expression',
            },
          },
          {
            sectionTitle: {
              id: 'global.settings',
              defaultMessage: 'Settings',
            },
            items: [
              {
                name: 'required',
                type: 'checkbox',
                intlLabel: {
                  id: getTrad('color-picker.options.advanced.requiredField'),
                  defaultMessage: 'Required field',
                },
                description: {
                  id: getTrad('color-picker.options.advanced.requiredField.description'),
                  defaultMessage: "You won't be able to create an entry if this field is empty",
                },
              },
            ],
          },
        ],
      },
    });
  },

  bootstrap(app) {},
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
