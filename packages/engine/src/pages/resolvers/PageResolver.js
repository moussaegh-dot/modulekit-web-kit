import ComponentResolver from "./ComponentResolver";
import LayoutResolver from "./LayoutResolver";
import PageResourceResolver from "./PageResourceResolver";
import ActionResourceResolver from "./ActionResourceResolver";

export default class PageResolver {

    static resolve(module, pageKey = "index") {

        const descriptor =
            module.ui.pages?.[pageKey];

        if (!descriptor) {
            return null;
        }

        const resources =
            PageResourceResolver.resolve(
                module.ui,
                descriptor
            );

        return {
            module,
            pageKey,
            descriptor,

            componentName: descriptor.component,

            component: ComponentResolver.page(
                descriptor.component
            ),

            layout: LayoutResolver.resolve(
                module,
                descriptor
            ),

            resources,

            actions: {
                row: ActionResourceResolver.rows(
                    resources.actions
                ),

                bulk: ActionResourceResolver.bulk(
                    resources.actions
                ),
            },
        };
    }

}