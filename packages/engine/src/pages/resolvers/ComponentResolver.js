import {
    WidgetRegistry,
    ComponentRegistry,
    MetricRegistry,
} from "../../registries";


const registries = {
    component: ComponentRegistry,
    widget: WidgetRegistry,
    metric: MetricRegistry,
};


export default class ComponentResolver {

    static resolve(type, key) {

        const registry = registries[type];

        if (!registry) {
            return null;
        }


        /*
        |--------------------------------------------------------------------------
        | Registry sous forme de classe
        |--------------------------------------------------------------------------
        */

        if (typeof registry.resolve === "function") {
            return registry.resolve(key);
        }


        /*
        |--------------------------------------------------------------------------
        | Registry sous forme d'objet
        |--------------------------------------------------------------------------
        */

        return registry[key] ?? null;

    }


    static page(name) {

        return this.resolve(
            "component",
            name
        );

    }


    static widget(key) {

        return this.resolve(
            "widget",
            key
        );

    }


    static metric(key) {

        return this.resolve(
            "metric",
            key
        );

    }

}