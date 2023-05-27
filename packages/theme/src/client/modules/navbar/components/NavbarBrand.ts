import { useRouteLocale, useSiteLocaleData, withBase } from "@vuepress/client";
import { type VNode, computed, defineComponent, h } from "vue";
import { RouterLink } from "vue-router";

import { useThemeLocaleData } from "@theme-hope/composables/index";

import "../styles/navbar-brand.scss";

export default defineComponent({
  name: "NavbarBrand",

  setup() {
    const routeLocale = useRouteLocale();
    const siteLocale = useSiteLocaleData();
    const themeLocale = useThemeLocaleData();

    const siteBrandLink = computed(
      () => themeLocale.value.home || routeLocale.value
    );

    const siteTitle = computed(() => siteLocale.value.title);
    const siteBrandTitle = computed(
      () => themeLocale.value.navTitle ?? siteTitle.value
    );

    const siteBrandLogo = computed(() =>
      themeLocale.value.logo ? withBase(themeLocale.value.logo) : null
    );

    const siteBrandLogoDark = computed(() =>
      themeLocale.value.logoDark ? withBase(themeLocale.value.logoDark) : null
    );

    return (): VNode =>
      h(RouterLink, { to: siteBrandLink.value, class: "brand" }, () => [
        siteBrandLogo.value
          ? h("img", {
              class: ["logo", { light: Boolean(siteBrandLogoDark.value) }],
              src: siteBrandLogo.value,
              alt: siteTitle.value,
            })
          : null,
        siteBrandLogoDark.value
          ? h("img", {
              class: ["logo dark"],
              src: siteBrandLogoDark.value,
              alt: siteTitle.value,
            })
          : null,
        siteBrandTitle.value
          ? h(
              "span",
              {
                class: [
                  "site-name",
                  {
                    "hide-in-pad":
                      siteBrandLogo.value &&
                      themeLocale.value.hideSiteNameOnMobile !== false,
                  },
                ],
              },
              siteBrandTitle.value
            )
          : null,
      ]);
  },
});
