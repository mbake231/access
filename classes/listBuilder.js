var api = require("./api.js");
const { Db } = require("mongodb");

class listBuilder {
  constructor(user_id, list_id, date) {
    this.list = [];
    this.date = date;
    this.list_id = list_id;
    this.user_id = user_id;
    this.item_list = [];
  }

  async initialize(list_id, date, cb) {
    await api.getUser(this.user_id, function (data) {
      var ctr1 = 0;
      var my_list;
      while (ctr1 < data.checklists.length) {
        if (data.checklists[ctr1].list_id === list_id) {
          my_list = data.checklists[ctr1];
          ctr1 = data.checklists.length;
        }
        ctr1++;
      }
      for (var i = 0; i < my_list.items.length; i++) {
        let ctr = 0;
        while (ctr < data.items.length) {
          if (data.items[ctr].item_id === my_list.items[i].itemid) {
            my_list.items[i].item_name = data.items[ctr].item_name;
            my_list.items[i].item_desc = data.items[ctr].item_desc;
            my_list.items[i].item_type = data.items[ctr].item_type;
            my_list.items[i].item_type = data.items[ctr].item_type;
            let ctr2 = 0;
            while (ctr2 < data.items[ctr].item_history.length) {
              let date1 = new Date(data.items[ctr].item_history[ctr2].date);
              let date2 = new Date(date);
              //console.log(date1+' '+date2)
              if (date1.toDateString() === date2.toDateString()) {
                my_list.items[i].item_value =
                  data.items[ctr].item_history[ctr2].value;
                ctr2 = data.items[ctr].item_history.length;
              }
              ctr2++;
            }
          }
          ctr++;
        }
      }
      return cb(my_list);
    });
  }
}

//exports.listBuilder = listBuilder;
module.exports = listBuilder;
