import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import Wind from "./presets/wind";
import Button from "primevue/button";
import Column from "primevue/column";
import ConfirmDialog from "primevue/confirmdialog";
import ConfirmationService from "primevue/confirmationservice";
import DataTable from "primevue/datatable";
import Dialog from "primevue/dialog";
import Divider from "primevue/divider";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import Menu from "primevue/menu";
import Message from "primevue/message";
import Password from "primevue/password";
import Ripple from "primevue/ripple";
import Textarea from "primevue/textarea";
import Toast from "primevue/toast";
import ToastService from "primevue/toastservice";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Tag from "primevue/tag";
import Tooltip from "primevue/tooltip";
import VCalendar from "v-calendar";
import 'v-calendar/style.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue, {
  unstyled: false,
  pt: Wind,
  ripple: true,
});
app.use(VCalendar, {});
app.use(ConfirmationService);
app.use(ToastService);
app.directive("tooltip", Tooltip);
app.directive("ripple", Ripple);
app.component("Button", Button);
app.component("Column", Column);
app.component("ConfirmDialog", ConfirmDialog);
app.component("DataTable", DataTable);
app.component("DataView", DataView);
app.component("Dialog", Dialog);
app.component("Divider", Divider);
app.component("Dropdown", Dropdown);
app.component("InputText", InputText);
app.component("Menu", Menu);
app.component("Message", Message);
app.component("Password", Password);
app.component("TabView", TabView);
app.component("TabPanel", TabPanel);
app.component("Tag", Tag);
app.component("Textarea", Textarea);
app.component("Toast", Toast);

app.mount("#app");
