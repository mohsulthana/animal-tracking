// import firebase from 'firebase'

const getters = {
  animals: state => state.data.animals,
  animalcategories: state => state.data.animalcategories,
  animalcount(state, getters) { return getters.animals.length },
  animalgenderagecount(state, getters) {
    var cattleAdultMaleCount = getters.cattlelist.filter(ani => ani.gender == 'M' && ani.monthage > 12).length
    var cattleAdultFemaleCount = getters.cattlelist.filter(ani => ani.gender == 'F' && ani.monthage > 12).length
    var cattleYoungMaleCount = getters.cattlelist.filter(ani => ani.gender == 'M' && ani.monthage <= 12).length
    var cattleYoungFemaleCount = getters.cattlelist.filter(ani => ani.gender == 'F' && ani.monthage <= 12).length

    var bokAdultMaleCount = getters.boklist.filter(ani => ani.gender == 'M' && ani.monthage > 12).length
    var bokAdultFemaleCount = getters.boklist.filter(ani => ani.gender == 'F' && ani.monthage > 12).length
    var bokYoungMaleCount = getters.boklist.filter(ani => ani.gender == 'M' && ani.monthage <= 12).length
    var bokYoungFemaleCount = getters.boklist.filter(ani => ani.gender == 'F' && ani.monthage <= 12).length

    var sheepAdultMaleCount = getters.sheeplist.filter(ani => ani.gender == 'M' && ani.monthage > 12).length
    var sheepAdultFemaleCount = getters.sheeplist.filter(ani => ani.gender == 'F' && ani.monthage > 12).length
    var sheepYoungMaleCount = getters.sheeplist.filter(ani => ani.gender == 'M' && ani.monthage <= 12).length
    var sheepYoungFemaleCount = getters.sheeplist.filter(ani => ani.gender == 'F' && ani.monthage <= 12).length

    var goatAdultMaleCount = getters.goatlist.filter(ani => ani.gender == 'M' && ani.monthage > 12).length
    var goatAdultFemaleCount = getters.goatlist.filter(ani => ani.gender == 'F' && ani.monthage > 12).length
    var goatYoungMaleCount = getters.goatlist.filter(ani => ani.gender == 'M' && ani.monthage <= 12).length
    var goatYoungFemaleCount = getters.goatlist.filter(ani => ani.gender == 'F' && ani.monthage <= 12).length

    return { cattleAdultMaleCount: cattleAdultMaleCount,
      cattleAdultFemaleCount: cattleAdultFemaleCount,
      cattleYoungMaleCount: cattleYoungMaleCount,
      cattleYoungFemaleCount: cattleYoungFemaleCount,
      goatAdultMaleCount: goatAdultMaleCount,
      goatAdultFemaleCount: goatAdultFemaleCount,
      goatYoungMaleCount: goatYoungMaleCount,
      goatYoungFemaleCount: goatYoungFemaleCount,
      bokAdultMaleCount: bokAdultMaleCount,
      bokAdultFemaleCount: bokAdultFemaleCount,
      bokYoungMaleCount: bokYoungMaleCount,
      bokYoungFemaleCount: bokYoungFemaleCount,
      sheepAdultMaleCount: sheepAdultMaleCount,
      sheepAdultFemaleCount: sheepAdultFemaleCount,
      sheepYoungMaleCount: sheepYoungMaleCount,
      sheepYoungFemaleCount: sheepYoungFemaleCount
    }
  },
  avatar: state => state.user.avatar,
  boklist(state) { return state.data.animals.filter(anim => anim.category === 'Bok') },
  boklistcount(state, getters) { return getters.boklist.length },
  cachedViews: state => state.tagsView.cachedViews,
  categoryfootage(state, getters) {
    var categoryfootages = []
    var days = []
    var today = new Date()
    for (let i = 0; i < 365; i++) {
      var day = new Date(today)
      day.setDate(today.getDate() - i)
      days.push(day.toISOString().slice(0, -8))
    }
    // console.log(days)

    // console.log(this.$store.state.animals.length)
    // console.log("countanimalfootages:" + this.$store.getters.footages.length)

    // let t1 = performance.now();
    state.data.animalcategories.forEach(c => {
      var in7days = [0, 0, 0, 0, 0, 0, 0]
      var in1month = [0, 0, 0, 0]
      var in6months = [0, 0, 0, 0, 0, 0]
      var in1year = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

      state.data.animals.filter(a => a.category === c.name).forEach(animal => {
      // console.log(this.$store.state.footages.some(f => animal.animalID === f.animalID && f.date>days[364] && f.date<days[0]))
        var animfoo = getters.footages.filter(f => animal.animalID === f.animalID)
        if (animfoo.length) {
          // console.log("found animal footages")
          for (let i = 0; i < 7; i++) {
            if (animfoo.find(f => f.date > days[i + 1] && f.date <= days[i])) {
              in7days[6 - i]++
            }
          }
          var j = 0
          for (let i = 0; i < 30; i += 7) {
            if (animfoo.find(f => f.date > days[i + 7] && f.date <= days[i])) {
              in1month[3 - j]++
            }
            j++
          }
          j = 0
          for (let i = 0; i < 180; i += 30) {
            if (animfoo.find(f => f.date > days[i + 30] && f.date <= days[i])) {
              in6months[5 - j]++
            }
            j++
          }
          j = 0
          for (let i = 0; i < 365; i += 30) {
            if (animfoo.find(f => f.date > days[i + 30] && f.date <= days[i])) {
              in1year[11 - j]++
            }
            j++
          }
        }
      })
      categoryfootages.push({
        categoryname: c.name,
        footages: {
          in7days: in7days,
          in1month: in1month,
          in6months: in6months,
          in1year: in1year
        }
      })
    })

    return categoryfootages
  },
  cattlelist(state) { return state.data.animals.filter(anim => anim.category === 'Cattle') },
  cattlelistcount(state, getters) { return getters.cattlelist.length },
  device: state => state.app.device,
  errorLogs: state => state.errorLog.logs,
  firstanimalsnapshot: state => state.data.firstanimalsnapshot,
  firstfootagesnapshot: state => state.data.firstfootagesnapshot,
  footagecount(state, getters) {
    var days = []
    var today = new Date()
    for (let i = 0; i < 365; i++) {
      var day = new Date(today)
      day.setDate(today.getDate() - i)
      days.push(day.toISOString().slice(0, -8))
    }
    // console.log(days)
    var totalgoatin7days = [0, 0, 0, 0, 0, 0, 0]
    var totalbokin7days = [0, 0, 0, 0, 0, 0, 0]
    var totalsheepin7days = [0, 0, 0, 0, 0, 0, 0]
    var totalcattlein7days = [0, 0, 0, 0, 0, 0, 0]

    var totalgoatin1month = [0, 0, 0, 0]
    var totalbokin1month = [0, 0, 0, 0]
    var totalsheepin1month = [0, 0, 0, 0]
    var totalcattlein1month = [0, 0, 0, 0]

    var totalgoatin6months = [0, 0, 0, 0, 0, 0]
    var totalbokin6months = [0, 0, 0, 0, 0, 0]
    var totalsheepin6months = [0, 0, 0, 0, 0, 0]
    var totalcattlein6months = [0, 0, 0, 0, 0, 0]

    var totalgoatin1year = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    var totalbokin1year = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    var totalsheepin1year = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    var totalcattlein1year = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    console.log(state.data.animals.length)
    console.log('countanimalfootages:' + state.data.footages.length)

    // let t1 = performance.now();
    state.data.animals.forEach(animal => {
      // console.log(this.$store.state.footages.some(f => animal.animalID === f.animalID && f.date>days[364] && f.date<days[0]))
      var animfoo = getters.footages.filter(f => animal.animalID === f.animalID)
      if (animfoo.length) {
        // console.log("found animal footages")
        for (let i = 0; i < 7; i++) {
          if (animfoo.find(f => f.date > days[i + 1] && f.date <= days[i])) {
            switch (animal.category) {
              case 'Goat':
                totalgoatin7days[6 - i]++
                break
              case 'Sheep':
                totalsheepin7days[6 - i]++
                break
              case 'Bok':
                totalbokin7days[6 - i]++
                break
              case 'Cattle':
                totalcattlein7days[6 - i]++
                break
            }
          }
        }
        var j = 0
        for (let i = 0; i < 30; i += 7) {
          if (animfoo.find(f => f.date > days[i + 7] && f.date <= days[i])) {
            switch (animal.category) {
              case 'Goat':
                totalgoatin1month[3 - j]++
                break
              case 'Sheep':
                totalsheepin1month[3 - j]++
                break
              case 'Bok':
                totalbokin1month[3 - j]++
                break
              case 'Cattle':
                totalcattlein1month[3 - j]++
                break
            }
            j++
          }
        }
        j = 0
        for (let i = 0; i < 180; i += 30) {
          if (animfoo.find(f => f.date > days[i + 30] && f.date <= days[i])) {
            switch (animal.category) {
              case 'Goat':
                totalgoatin6months[5 - j]++
                break
              case 'Sheep':
                totalsheepin6months[5 - j]++
                break
              case 'Bok':
                totalbokin6months[5 - j]++
                break
              case 'Cattle':
                totalcattlein6months[5 - j]++
                break
            }
            j++
          }
        }
        j = 0
        for (let i = 0; i < 365; i += 30) {
          if (animfoo.find(f => f.date > days[i + 30] && f.date <= days[i])) {
            switch (animal.category) {
              case 'Goat':
                totalgoatin1year[11 - j]++
                break
              case 'Sheep':
                totalsheepin1year[11 - j]++
                break
              case 'Bok':
                totalbokin1year[11 - j]++
                break
              case 'Cattle':
                totalcattlein1year[11 - j]++
                break
            }
            j++
          }
        }
      }
    })
    return { totalgoatin7days: totalgoatin7days,
      totalbokin7days: totalbokin7days,
      totalsheepin7days: totalsheepin7days,
      totalcattlein7days: totalcattlein7days,
      totalgoatin1month: totalgoatin1month,
      totalbokin1month: totalbokin1month,
      totalsheepin1month: totalsheepin1month,
      totalcattlein1month: totalcattlein1month,
      totalgoatin6months: totalgoatin6months,
      totalbokin6months: totalbokin6months,
      totalsheepin6months: totalsheepin6months,
      totalcattlein6months: totalcattlein6months,
      totalgoatin1year: totalgoatin1year,
      totalbokin1year: totalbokin1year,
      totalsheepin1year: totalsheepin1year,
      totalcattlein1year: totalcattlein1year
    }
  },
  // footagecount (state, getters) { return getters.footages.length;  },
  footages: state => state.data.footages,
  genders: state => state.data.genders,
  goatlist: state => state.data.animals.filter(anim => anim.category === 'Goat'),
  goatlistcount: state => state.data.animals.filter(anim => anim.category === 'Goat').length,
  introduction: state => state.user.introduction,
  name: state => state.user.name,
  permission_routes: state => state.permission.routes,
  qrcode: state => state.data.qrcode.Qrcode,
  roles: state => state.user.roles,
  sheeplist(state) { return state.data.animals.filter(anim => anim.category === 'Sheep') },
  sheeplistcount(state, getters) { return getters.sheeplist.length },
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  token: state => state.user.token,
  users: state => state.data.users,
  usercount: state => state.data.users.length,
  usercountadmin: state => state.data.users.filter(user => user.role == 'admin').length,
  usercountdeveloper: state => state.data.users.filter(user => user.role == 'Developer').length,
  usercountcustomer: state => state.data.users.filter(user => user.role == 'Customer').length,
  visitedViews: state => state.tagsView.visitedViews

}
export default getters
