<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { $fetch } from "ofetch";
import type { ApiResponse } from "types/api";

// assets
import logo from "../assets/logo.png";
import hillsgovhub from "../assets/hillsgovhub.png";
import bgPark from "../assets/bg-park.jpg";

const props = defineProps<{
  appBarTitle: string;
  appBarNavTooltip: string;
  navDrawerTitle: string;
  navDrawerSubtitle: string;
}>();

const drawer = ref<boolean>();

const env = computed(() => {
  let { host } = window.location;

  if (import.meta.env.DEV) {
    // host = "aca-prod.accela.com";
  }

  return ({
    "aca-supp.accela.com": "SUPPORT",
    "aca-test.accela.com": "TEST",
    "aca-nonprod.accela.com": "STAGE",
    "aca-prod.accela.com": "PRODUCTION",
  }[host.toLowerCase()] ?? "DEV") as
    | "SUPPORT"
    | "TEST"
    | "STAGE"
    | "PRODUCTION"
    | "DEV";
});

const data = ref<ApiResponse>();

onMounted(async () => {
  data.value = await $fetch<ApiResponse>(
    `${import.meta.env.BASE_URL.replace(/\/+$/, "")}/data.json`
  );
});

const entry = computed(() => {
  const [entry] = data.value?.entries ?? [];
  return entry;
});

/**
 *
 */
function prependInstaceToHref(href: string, prepend = true) {
  const [instance] = window.location.pathname.split("/").filter(Boolean);
  return prepend ? `/${instance || "hcfl"}` + href : href;
}

/**
 *
 */
function isInEnv(envs: string[]) {
  return [...envs, "DEV"].includes(env.value);
}
</script>

<template>
  <Suspense>
    <v-app>
      <v-app-bar
        density="comfortable"
        extended
        color="#054173"
        scroll-behavior="fully-hide elevate fade-image"
        :image="bgPark"
        extension-height="75"
      >
        <template v-slot:image>
          <v-img
            gradient="to bottom right, rgba(122,191,215,.8), rgba(5,65,115,.8)"
            alt="Decorative Gradient Image"
          />
        </template>

        <template v-slot:extension>
          <div class="d-flex align-center w-100 masdx-5">
            <img
              :src="logo"
              width="auto"
              height="48"
              class="d-block mx-3"
              alt="Hillsborough County Florida"
            />

            <div>
              <img
                :src="hillsgovhub"
                width="auto"
                height="24"
                class="d-block mx-3"
                alt="HillsGovHub"
              />

              <pre
                v-if="env !== 'PRODUCTION'"
                class="text-center font-weight-black bg-red-darken-2 text-white"
                >{{ env }}</pre
              >
            </div>

            <v-app-bar-nav-icon
              @click="drawer = !drawer"
              class="ms-auto mx-3"
              :aria-label="appBarNavTooltip"
            ></v-app-bar-nav-icon>
          </div>
        </template>
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" mobile-breakpoint="sm" width="275">
        <v-list-item class="my-2">
          <v-list-item-title class="text-h6">
            {{ navDrawerTitle }}
          </v-list-item-title>
          <v-list-item-subtitle> {{ navDrawerSubtitle }} </v-list-item-subtitle>
        </v-list-item>
        <v-divider></v-divider>

        <v-list open-strategy="single">
          <template v-for="item in entry?.navigation_links ?? []">
            <v-list-group
              v-if="
                isInEnv(item.attributes.environments) && item.child_links.length
              "
              :prepend-icon="item.icon"
            >
              <template #activator="{ isOpen, props }">
                <v-list-item
                  v-bind="props"
                  :title="item.link.title"
                  :aria-label="item.link.title"
                />
              </template>

              <template v-for="child in item.child_links">
                <v-list-item
                  v-if="isInEnv(child.attributes.environments)"
                  :href="
                    prependInstaceToHref(
                      child.link.href,
                      child.attributes.prepend_instance
                    )
                  "
                  :aria-label="child.link.title"
                  :target="child.attributes.target || '_self'"
                  :key="child._metadata.uid"
                >
                  <v-list-item-title :title="child.link.title">
                    {{ child.link.title }}
                  </v-list-item-title>
                </v-list-item>
              </template>
            </v-list-group>

            <!--  -->
            <v-list-item
              v-else-if="isInEnv(item.attributes.environments)"
              link
              :title="item.link.title"
              :aria-label="item.link.title"
              :href="
                prependInstaceToHref(
                  item.link.href,
                  item.attributes.prepend_instance
                )
              "
              :prepend-icon="item.icon"
              role="listitem"
            />
          </template>
        </v-list>
      </v-navigation-drawer>

      <!--  -->
      <v-main tag="div">
        <v-container id="app-container">
          <slot></slot>
        </v-container>
      </v-main>

      <!--  -->
      <v-footer app absolute color="#054173">
        <v-card dark flat tile color="#054173" class="text-center" width="100%">
          <v-card-text
            class="d-flex align-center justify-center ga-2 flex-wrap flex-grow-1 py-3"
          >
            <template v-for="item in entry?.footer_links ?? []">
              <v-btn
                v-if="isInEnv(item.attributes.environments)"
                :href="
                  prependInstaceToHref(
                    item.link.href,
                    item.attributes.prepend_instance
                  )
                "
                :target="item.attributes.target || '_blank'"
                color="white"
                variant="text"
                rounded
                class="my-2"
                :text="item.link.title"
                :aria-label="item.link.title"
                :key="item._metadata.uid"
              >
              </v-btn>
            </template>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-text
            class="d-flex align-center justify-center ga-2 flex-wrap flex-grow-1 py-3"
          >
            <template v-for="item in entry?.social_links ?? []">
              <v-btn
                v-if="isInEnv(item.attributes.environments)"
                :href="
                  prependInstaceToHref(
                    item.link.href,
                    item.attributes.prepend_instance
                  )
                "
                icon
                :title="item.link.title"
                :aria-label="item.link.title"
                :target="item.attributes.target || '_blank'"
                :key="item._metadata.uid"
                variant="outlined"
              >
                <v-icon :icon="item.icon"></v-icon>
              </v-btn>
            </template>
          </v-card-text>
        </v-card>
      </v-footer>
    </v-app>
  </Suspense>
</template>
