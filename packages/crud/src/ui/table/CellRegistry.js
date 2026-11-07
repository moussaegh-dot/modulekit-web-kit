/**
 * 📁 CellRegistry.js
 */

import TextCell from "./components/cells/TextCell";
import BadgeCell from "./components/cells/BadgeCell";
import AvatarCell from "./components/cells/AvatarCell";
import DateCell from "./components/cells/DateCell";
import CurrencyCell from "./components/cells/CurrencyCell";
import IdentityCell from "./components/cells/IdentityCell";
import RelationCell from "./components/cells/RelationCell";


class CellRegistry
{
    constructor()
    {
        this.cells = {};
    }


    register(type, component)
    {
        this.cells[type] = component;
    }


    resolve(type)
    {
        return this.cells[type]
            ?? this.cells.text;
    }
}


const registry = new CellRegistry();

registry.register("text", TextCell);
registry.register("badge", BadgeCell);
registry.register("avatar", AvatarCell);
registry.register("identity", IdentityCell);
registry.register("date", DateCell);
registry.register("currency", CurrencyCell);
registry.register("relation", RelationCell);


export default registry;
