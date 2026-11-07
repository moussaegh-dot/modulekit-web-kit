/**
 * 📁 src/core/form/fieldRegistry.js
 * 🎯 Central Field Registry (plugin system)
 */

import TextField from "./inputs/TextField";
import TextAreaField from "./inputs/TextAreaField";
import EmailField from "./inputs/EmailField";
import PasswordField from "./inputs/PasswordField";
import DateField from "./inputs/DateField";
import FileField from "./inputs/FileField";
import SelectField from "./inputs/SelectField";
import RelationSelectField from "./inputs/RelationSelectField";
import NumberField from "./inputs/NumberField";
import { number } from "prop-types";

export const fieldRegistry = {
  text: TextField,
  textarea: TextAreaField,
  email: EmailField,
  password: PasswordField,
  date: DateField,
  file: FileField,
  select: SelectField,
  relation : RelationSelectField,
  number : NumberField,
};