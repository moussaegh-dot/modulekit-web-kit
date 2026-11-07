/**
 * 📁 src/core/form/view/viewFieldRegistry.js
 */

import TextView from "./fields/TextView";
import EmailView from "./fields/EmailView";
import NumberView from "./fields/NumberView";
import DateView from "./fields/DateView";
import AvatarView from "./fields/AvatarView";
import BadgeView from "./fields/BadgeView";
import RelationView from "./fields/RelationView";


export const viewFieldRegistry = {

    text: TextView,

    email: EmailView,

    number: NumberView,

    date: DateView,

    avatar: AvatarView,

    badge: BadgeView,

    relation: RelationView,

};