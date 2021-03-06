<template>
  <div class="tags-view-container">
    <scroll-pane class='tags-view-wrapper' ref='scrollPane'>
      <router-link ref='tag' class="tags-view-item" :class="isActive(tag)?'active':''"
        v-for="tag in Array.from(visitedViews)"
        :to="tag.fullPath" :key="tag.fullPath" @contextmenu.prevent.native="openMenu(tag,$event)">
        <span class="tag-tit">{{generateTitle(tag.title)}}</span>
        <span class='el-icon-close' @click.prevent.stop='closeSelectedTag(tag)'></span>
      </router-link>
    </scroll-pane>
    <ul class='contextmenu' v-show="visible" :style="{left:left+'px',top:top+'px'}">
      <li @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其它</li>
      <li @click="closeAllTags">关闭所有</li>
    </ul>
  </div>
</template>

<script>
import ScrollPane from '@/components/ScrollPane';

export default {
  name: 'TagsView',
  components: { ScrollPane },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
    };
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews;
    },
  },
  watch: {
    $route() {
      this.addViewTags();
      this.moveToCurrentTag();
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu);
      } else {
        document.body.removeEventListener('click', this.closeMenu);
      }
    },
  },
  mounted() {
    this.addViewTags();
  },
  methods: {
    generateTitle(title) {
      return title;
    },
    generateRoute() {
      return this.$route;
    },
    isActive(route) {
      return route.fullPath === this.$route.fullPath;
    },
    addViewTags() {
      const route = this.generateRoute();
      if (!route) {
        return;
      }
      this.$store.dispatch('addVisitedViews', route);
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag || [];
      this.$nextTick(() => {
        // eslint-disable-next-line
        for (const tag of tags) {
          if (tag.to === this.$route.fullPath) {
            this.$refs.scrollPane.moveToTarget(tag.$el);
            break;
          }
        }
      });
    },
    closeSelectedTag(view) {
      this.$store.dispatch('delVisitedViews', view).then((views) => {
        if (this.isActive(view)) {
          const latestView = views.slice(-1)[0];
          if (latestView) {
            this.$router.push(latestView.fullPath);
          } else {
            this.$router.push('/');
          }
        }
      });
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag.fullPath);
      this.$store.dispatch('delOthersViews', this.selectedTag).then(() => {
        this.moveToCurrentTag();
      });
    },
    closeAllTags() {
      this.$store.dispatch('delAllViews');
      this.$router.push('/');
    },
    openMenu(tag, e) {
      this.visible = true;
      this.selectedTag = tag;
      this.left = e.clientX + 10;
      this.top = e.clientY;
    },
    closeMenu() {
      this.visible = false;
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.tags-view-container {
  position: relative;
  .tags-view-wrapper {
    height: 50px;
    .tags-view-item {
      display: inline-block;
      position: relative;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      text-decoration: none;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 100;
    position: fixed;
    list-style-type: none;
    padding: 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      line-height: 30px;
      margin: 0;
      padding: 0 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    padding: 0 5px 0 8px !important;

    .tag-tit {
      text-align: center;
      display: inline-block;
      min-width: 2em;
      padding: 0 3px 0 6px;
    }

    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(.7);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
