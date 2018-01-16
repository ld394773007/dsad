<template>
  <div class="__vev_calendar-wrapper">
    <cal-panel
      :hideHeader="showHeader"
      :events="events"
      :calendar="calendarOptions"
      :selectedDay='selectedDayEvents.date'
      @updateDate="updateDate"
      :selectedDate="selectedDate"
      @cur-day-changed="handleChangeCurDay"
      @month-changed="handleMonthChanged">
    </cal-panel>
    <cal-events
      v-if="showEvent"
      :dayEvents="selectedDayEvents"
      :locale="calendarOptions.options.locale"
      :color="calendarOptions.options.color">
      <slot :showEvents="selectedDayEvents.events"></slot>
    </cal-events>
  </div>
</template>
<script>
import {isEqualDateStr} from './tools.js'
import calEvents from './components/cal-events.vue'
import calPanel from './components/cal-panel.vue'
const inBrowser = typeof window !== 'undefined'
export default {
  name: 'vue-event-calendar',
  components: {
    'cal-events': calEvents,
    'cal-panel': calPanel
  },
  data () {
    return {
      selectedDate: '',
      selectedDayEvents: {
        date: 'all',
        events: this.events || []  // default show all event
      }
    }
  },
  props: {
    showEvent: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    events: {
      type: Array,
      required: true,
      default: [],
      validator (events) {
        let validate = true
        events.forEach((event, index) => {
          if (!event.date) {
            console.error('Vue-Event-Calendar-Error:' + 'Prop events Wrong at index ' + index)
            validate = false
          }
        })
        return validate
      }
    }
  },
  computed: {
    calendarOptions () {
      let dateObj = new Date()
      if (inBrowser) {
        return window.VueCalendarBarEventBus.CALENDAR_EVENTS_DATA
      } else {
        return {
          options: {
            locale: 'en', // zh
            color: ' #f29543'
          },
          params: {
            curYear: dateObj.getFullYear(),
            curMonth: dateObj.getMonth(),
            curDate: dateObj.getDate(),
            curEventsDate: 'all'
          }
        }
      }
    },
    calendarParams () {
      let dateObj = new Date()
      if (inBrowser) {
        return window.VueCalendarBarEventBus.CALENDAR_EVENTS_DATA.params
      } else {
        return {
          curYear: dateObj.getFullYear(),
          curMonth: dateObj.getMonth(),
          curDate: dateObj.getDate(),
          curEventsDate: 'all'
        }
      }
    }
  },
  created () {
    if (this.calendarParams.curEventsDate !== 'all') {
      this.handleChangeCurDay(this.calendarParams.curEventsDate)
    }
  },
  methods: {
    handleChangeCurDay (date) {
      let events = this.events.filter(function (event) {
        return isEqualDateStr(event.date, date)
      })
      // if (events.length > 0) {
      //   this.selectedDayEvents = {
      //     date: date,
      //     events: events
      //   }
      // }

      this.selectedDate = date
      this.$emit('day-changed', {
        date: date,
        events: events
      })
    },
    handleMonthChanged (yearMonth) {
      this.$emit('month-changed', yearMonth)
    },
    updateDate (date) {
      this.$emit('updateDate', date)
    }
  },
  watch: {
    calendarParams () {
      if (this.calendarParams.curEventsDate !== 'all') {
        let events = this.events.filter(event => {
          return isEqualDateStr(event.date, this.calendarParams.curEventsDate)
        })
        this.selectedDayEvents = {
          date: this.calendarParams.curEventsDate,
          events
        }
      } else {
        this.selectedDayEvents = {
          date: 'all',
          events: this.events
        }
      }
    },
    events () {
      this.selectedDayEvents = {
        date: 'all',
        events: this.events || []
      }
    }
  }
}
</script>
<style lang="less">
@base-orange: #eff1f5;
@white: #ffffff;
@gray: #e0e0e0;
@gray-dark: #b1b1b1;
@large-padding: 15px;
@small-padding: 10px;
@icon-border-size: 1px;
@media screen and (min-width: 768px) {
  .__vev_calendar-wrapper{
    display: flex;
    margin: 0 auto;
    .cal-wrapper{
      flex: 3;
      .date-num{
        line-height: 50px;
      }
    }
    .events-wrapper{
      position: relative;
      flex: 2;
      color: @white;
    }
  }
}
@media screen and (max-width: 768px) {
  .__vev_calendar-wrapper{
    .cal-wrapper{
      width: 100%;
      padding: 10px 5px;
      .date-num{
        line-height: 42px;
      }
    }
    .events-wrapper{
      width: 100%;
      margin-top: 10px;
      padding: 10px;
    }
  }
}
.__vev_calendar-wrapper{
  position: relative;
  overflow: hidden;
  width: 100%;
  *{
    box-sizing: border-box;
  }
  ::-webkit-scrollbar{
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 2px rgba(0,0,0,.2);
    border-radius: 5px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: rgba(0,0,0,.2);
  }
  .cal-wrapper{
    .cal-header{
      position: relative;
      width: 100%;
      background-color: @white;
      // box-shadow: 0 6px 5px rgba(0,0,0,.1);
      font-weight: 500;
      overflow: hidden;
      padding-bottom: 10px;
      &>div{
        float: left;
        line-height: 20px;
        padding: @large-padding;
      }
      .title{
        width: 60%;
        text-align: center;
      }
      .l{
        text-align: left;
        width: 20%;
        cursor: pointer;
        user-select: none;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      }
      .r{
        text-align: right;
        width: 20%;
        cursor: pointer;
        user-select: none;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      }
    }
    .cal-body{
      width: 100%;
      .weeks{
        width: 100%;
        overflow: hidden;
        text-align: center;
        font-size: 1rem;
        .item{
          color: #ADADBD;
          line-height: 50px;
          float: left;
          width: 14.285%;
        }
      }
      .dates{
        width: 100%;
        overflow: hidden;
        text-align: center;
        font-size: 1rem;
        .item{
          margin-bottom: 8px;
          position: relative;
          float: left;
          display: block;
          width: 14.285%;
          cursor: default;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          .date-num{
            font-size: 1rem;
            position: relative;
            z-index: 3;
          }
          &.event{
            cursor: pointer;
          }
          &.selected-day{
            .is-event{
              background-color: @base-orange;
            }
          }
          .is-event{
            content: '';
            background-color: @base-orange;
            width: 100%;
            height: 100%;
            position: absolute;
            left: 50%;
            top: 0;
            z-index: 1;
            transform: translateX(-50%);
          }
          .is-today {
            content: '';
            background-color: @base-orange;
            opacity: .8;
            width: 70%;
            height: 100%;
            position: absolute;
            left: 50%;
            top: 0;
            z-index: 2;
            transform: translateX(-50%);
          }
          .is-selected {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            border: 1px @base-orange solid;
            z-index: 4;
          }
          .is-event-icon {
            position: absolute;
            display: flex;
            justify-content: space-between;
            bottom: 5px;
            left: 50%;
            width: 16px;
            transform: translateX(-50%);
            i {
              border-radius: 50%;
              width: 3px;
              height: 3px;
              background-color: rgb(52, 169, 255);
            }
            z-index: 3;
          }
        }
      }
    }
  }
  .events-wrapper{
    .cal-events{
      border-left: 1px #ADADBD dashed;
      position: absolute;
      display: flex;
      flex-direction: column;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      overflow-y: auto;
      padding: 0 15px;
      margin: 15px 0;
    }
    .date{
      max-width: 60%;
      min-width: 200px;
      text-align: center;
      color: @white;
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 20px;
      margin: 0 auto;
      font-size: 22px;
    }
    .event-item{
      padding: 5px 20px;
      margin-top: 15px;
      box-shadow: 0 3px 11px 2px rgba(0,0,0,.1);
      background-color: #fff;
      border-radius: 5px;
      color: #323232;
      position: relative;
      &:first-child{
        margin-top: 0;
      }
      .title{
        height: 40px;
        line-height: 40px;
        color: #323232;
        font-size: 16px;
        border-bottom: 1px solid #f2f2f2;
      }
      .time{
        position: absolute;
        right: 30px;
        top: 17px;
        color: #9b9b9b;
        font-size: 14px;
      }
      .desc{
        color: #9b9b9b;
        font-size: 14px;
        padding: 7px 0;
      }
    }
  }
  .arrow-left.icon {
    color: #000;
    position: absolute;
    left: 6%;
    margin-top: 10px;
  }
  .arrow-left.icon:before {
    content: '';
    position: absolute;
    left: 1px;
    top: -5px;
    width: 10px;
    height: 10px;
    border-top: solid @icon-border-size currentColor;
    border-right: solid @icon-border-size currentColor;
    -webkit-transform: rotate(-135deg);
            transform: rotate(-135deg);
  }
  .arrow-right.icon {
    color: #000;
    position: absolute;
    right: 6%;
    margin-top: 10px;
  }
  .arrow-right.icon:before {
    content: '';
    position: absolute;
    right: 1px;
    top: -5px;
    width: 10px;
    height: 10px;
    border-top: solid @icon-border-size currentColor;
    border-right: solid @icon-border-size currentColor;
    -webkit-transform: rotate(45deg);
            transform: rotate(45deg);
  }
  h3, p{
    margin: 0;
    padding: 0;
  }
}
</style>
