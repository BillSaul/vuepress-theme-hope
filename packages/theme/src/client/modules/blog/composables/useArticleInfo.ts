import { getDate } from "@vuepress/helper/client";
import {
  getReadingTimeLocale,
  useReadingTimeLocaleConfig,
} from "@vuepress/plugin-reading-time/client";
import type { ComputedRef, Ref } from "vue";
import { computed, toRef } from "vue";
import type { AuthorInfo } from "vuepress-shared/client";
import { getAuthor, getCategory, getTag } from "vuepress-shared/client";

import { useThemeLocaleData } from "@theme-hope/composables/index";
import type { PageInfoProps } from "@theme-hope/modules/info/components/PageInfo";
import type {
  PageCategory,
  PageTag,
} from "@theme-hope/modules/info/utils/index";

import { useBlogOptions } from "./useBlogOptions.js";
import { useCategoryMap } from "./useCategoryMap.js";
import { useTagMap } from "./useTagMap.js";
import type {
  ArticleInfoData,
  PageInfoType,
} from "../../../../shared/index.js";

export type AuthorRef = ComputedRef<AuthorInfo[]>;

export const useArticleAuthor = (info: Ref<ArticleInfoData>): AuthorRef => {
  const themeLocale = useThemeLocaleData();

  return computed(() => {
    const { ["author"]: author } = info.value;

    if (author) return getAuthor(author);
    if (author === false) return [];

    return getAuthor(themeLocale.value.author, false);
  });
};

export type CategoryRef = ComputedRef<PageCategory[]>;

export const useArticleCategory = (info: Ref<ArticleInfoData>): CategoryRef => {
  const categoryMap = useCategoryMap();

  return computed(() =>
    getCategory(info.value.category).map((name) => ({
      name,
      path: categoryMap.value.map[name].path,
    })),
  );
};

export type TagRef = ComputedRef<PageTag[]>;

export const useArticleTag = (info: Ref<ArticleInfoData>): TagRef => {
  const tagMap = useTagMap();

  return computed(() =>
    getTag(info.value.tag).map((name) => ({
      name,
      path: tagMap.value.map[name].path,
    })),
  );
};

export type DateRef = ComputedRef<Date | null>;

export const useArticleDate = (info: Ref<ArticleInfoData>): DateRef =>
  computed(() => {
    const { ["date"]: timestamp } = info.value;

    return getDate(timestamp);
  });

export const useArticleInfo = (props: {
  info: ArticleInfoData;
  path: string;
}): {
  info: ComputedRef<PageInfoProps>;
  items: ComputedRef<PageInfoType[] | false | null>;
} => {
  const articleInfo = toRef(props, "info");
  const blogOptions = useBlogOptions();
  const author = useArticleAuthor(articleInfo);
  const category = useArticleCategory(articleInfo);
  const tag = useArticleTag(articleInfo);
  const date = useArticleDate(articleInfo);
  const readingTimeLocaleConfig = useReadingTimeLocaleConfig();

  const info = computed(() => ({
    author: author.value,
    category: category.value,
    date: date.value,
    localizedDate: articleInfo.value.localizedDate ?? "",
    tag: tag.value,
    isOriginal: articleInfo.value.isOriginal ?? false,
    readingTime: articleInfo.value.readingTime ?? null,
    readingTimeLocale:
      articleInfo.value.readingTime && readingTimeLocaleConfig.value
        ? getReadingTimeLocale(
            articleInfo.value.readingTime,
            readingTimeLocaleConfig.value,
          )
        : null,
    pageview: props.path,
  }));

  const items = computed(() => blogOptions.value.articleInfo ?? null);

  return { info, items };
};
