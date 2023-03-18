console.log("App start!");

window.addEventListener("load", function(){
    console.log("Main Start~!");

    const app = new Vue({
        el: "#main-app",
        template: `<section>
            <section id="resource-section">
                <div id="resource-top">
                    <div>{{gameData.resources.population.name}}</div>
                    <div>{{gameData.resources.morale.name}} {{Math.floor(10*gameData.resources.morale.effective)/10}}%</div>
                    <div>Year {{Math.floor(gameData.runinfo.time/365)}} Day {{Math.floor(gameData.runinfo.time%365)+1}}</div>
                </div>
                <table>
                    <tr v-if="gameData.resources.money.visable">
                        <td>{{gameData.resources.money.name}}</td>
                        <td>{{Math.floor(gameData.resources.money.amount*10)/10}} / {{gameData.resources.money.max}}</td>
                        <td>{{Math.floor((gameData.resources.money.gain-gameData.resources.money.loss)*100)/100}}/s</td>
                    </tr>
                    <tr v-if="gameData.resources.population.visable">
                        <td>{{gameData.resources.population.name}}s</td>
                        <td>{{Math.floor(gameData.resources.population.amount)}} / {{gameData.resources.population.max}}</td>
                        <td></td>
                    </tr>
                    <tr v-for="resource in gameData.resources.research" v-if="resource.visable">
                        <td class="research-item">{{resource.name}}</td>
                        <td>{{Math.floor(resource.amount*10)/10}} / {{resource.max}}</td>
                        <td>{{Math.floor((resource.gain-resource.loss)*100)/100}}/s</td>
                    </tr>
                    <tr v-for="resource in gameData.resources.basic" v-if="resource.visable">
                        <td>{{resource.name}}</td>
                        <td>{{Math.floor(resource.amount*10)/10}} / {{resource.max}}</td>
                        <td>{{Math.floor((resource.gain-resource.loss)*100)/100}}/s</td>
                    </tr>
                    <tr v-for="resource in gameData.resources.luxury" v-if="resource.visable">
                        <td class="luxury-item">{{resource.name}}</td>
                        <td>{{Math.floor(resource.amount*10)/10}} / {{resource.max}}</td>
                        <td>{{Math.floor((resource.gain-resource.loss)*100)/100}}/s</td>
                    </tr>
                </table>
            </section>
            <section id="main-section">
                <nav id="tabs">
                    <ul>
                        <li v-for="tab in gameData.tabs" v-if="tab.visable"><a @click="selectTab(tab)" :class="{ selected: tab.selected }">{{tab.name}}</a></li>
                    </ul>
                </nav>
                <hr>
                <nav id="subtabs">
                    <ul v-for="tab in gameData.tabs" v-if="tab.selected">
                        <li v-for="subtab in tab.subtabs" v-if="subtab.visable"><a @click="selectSubTab(tab, subtab)" :class="{ selected: subtab.selected }">{{subtab.name}}</a></li>
                    </ul>
                </nav>
                <section id="world" v-if="this.gameData.tabs.world.selected">
                    <section id="city" v-if="this.gameData.tabs.world.subtabs.city.selected">
                        <div id="outskirts">
                            <div v-if="hasBuildings('outskirts')">Outskirts</div>
                            <button @click="gather(gameData.resources.basic.food)">Gather {{gameData.resources.basic.food.name}}</button>
                            <button @click="gather(gameData.resources.basic.wood)">Gather {{gameData.resources.basic.wood.name}}</button>
                            <button @click="gather(gameData.resources.basic.stone)">Gather {{gameData.resources.basic.stone.name}}</button>
                        </div>
                        <div id="residential">
                            <div v-if="hasBuildings('residential')">Residential</div>
                            <button class="tooltip" @click="buyBuilding(gameData.homeworld.buildings.residential.lodge)">{{gameData.homeworld.buildings.residential.lodge.name}}<span class="amount">{{gameData.homeworld.buildings.residential.lodge.amount}}</span>
                                <ul>
                                    <li>{{gameData.homeworld.buildings.residential.lodge.title}}</li>
                                    <hr>
                                    <li v-for="c in gameData.homeworld.buildings.residential.lodge.cost.basic">{{c.name}}: {{c.amount}}</li>
                                    <li v-for="c in gameData.homeworld.buildings.residential.lodge.cost.luxury">{{c.name}}: {{c.amount}}</li>
                                    <li v-for="c in gameData.homeworld.buildings.residential.lodge.cost.research">{{c.name}}: {{c.amount}}</li>
                                    <hr>
                                    <li v-for="storage in gameData.homeworld.buildings.residential.lodge.storage" v-if="storage.amount>0">+{{storage.amount}} Max {{storage.name}}</li>
                                    <hr>
                                    <li v-for="maintenance in gameData.homeworld.buildings.residential.lodge.maintenance" v-if="maintenance.amount>0">{{maintenance.name}} -{{maintenance.amount}}/s</li>
                                </ul>
                            </button>
                            <button class="tooltip" v-if="gameData.research.agriculture.completed" @click="buyBuilding(gameData.homeworld.buildings.residential.farm)">{{gameData.homeworld.buildings.residential.farm.name}}<span class="amount">{{gameData.homeworld.buildings.residential.farm.amount}}</span>
                                <ul>
                                    <li>{{gameData.homeworld.buildings.residential.farm.title}}</li>
                                    <hr>
                                    <li v-for="c in gameData.homeworld.buildings.residential.farm.cost.basic">{{c.name}}: {{c.amount}}</li>
                                    <li v-for="c in gameData.homeworld.buildings.residential.farm.cost.luxury">{{c.name}}: {{c.amount}}</li>
                                    <li v-for="c in gameData.homeworld.buildings.residential.farm.cost.research">{{c.name}}: {{c.amount}}</li>
                                    <hr>
                                    <li v-for="storage in gameData.homeworld.buildings.residential.farm.storage" v-if="storage.amount>0">+{{storage.amount}} Max {{storage.name}}</li>
                                    <hr>
                                    <li v-for="maintenance in gameData.homeworld.buildings.residential.farm.maintenance" v-if="maintenance.amount>0">{{maintenance.name}} -{{maintenance.amount}}/s</li>
                                </ul>
                            </button>
                        </div>
                        <div id="cultural">
                            <div v-if="hasBuildings('cultural')">Cultural</div>
                            <button class="tooltip" v-if="gameData.research.knowledge.completed" @click="buyBuilding(gameData.homeworld.buildings.cultural.library)">{{gameData.homeworld.buildings.cultural.library.name}}<span class="amount">{{gameData.homeworld.buildings.cultural.library.amount}}</span>
                                <ul>
                                    <li>{{gameData.homeworld.buildings.cultural.library.title}}</li>
                                    <hr>
                                    <li v-for="c in gameData.homeworld.buildings.cultural.library.cost.basic">{{c.name}}: {{c.amount}}</li>
                                    <li v-for="c in gameData.homeworld.buildings.cultural.library.cost.luxury">{{c.name}}: {{c.amount}}</li>
                                    <li v-for="c in gameData.homeworld.buildings.cultural.library.cost.research">{{c.name}}: {{c.amount}}</li>
                                    <hr>
                                    <li v-for="storage in gameData.homeworld.buildings.cultural.library.storage" v-if="storage.amount>0">+{{storage.amount}} Max {{storage.name}}</li>
                                    <hr>
                                    <li v-for="maintenance in gameData.homeworld.buildings.cultural.library.maintenance" v-if="maintenance.amount>0">{{maintenance.name}} -{{maintenance.amount}}/s</li>
                                </ul>
                            </button>
                            <button class="tooltip" v-if="gameData.research.faith.completed" @click="buyBuilding(gameData.homeworld.buildings.cultural.shrine)">{{gameData.homeworld.buildings.cultural.shrine.name}}<span class="amount">{{gameData.homeworld.buildings.cultural.shrine.amount}}</span>
                                <ul>
                                    <li>{{gameData.homeworld.buildings.cultural.shrine.title}}</li>
                                    <hr>
                                    <li v-for="c in gameData.homeworld.buildings.cultural.shrine.cost.basic">{{c.name}}: {{c.amount}}</li>
                                    <li v-for="c in gameData.homeworld.buildings.cultural.shrine.cost.luxury">{{c.name}}: {{c.amount}}</li>
                                    <li v-for="c in gameData.homeworld.buildings.cultural.shrine.cost.research">{{c.name}}: {{c.amount}}</li>
                                    <hr>
                                    <li v-for="storage in gameData.homeworld.buildings.cultural.shrine.storage" v-if="storage.amount>0">+{{storage.amount}} Max {{storage.name}}</li>
                                    <hr>
                                    <li v-for="maintenance in gameData.homeworld.buildings.cultural.shrine.maintenance" v-if="maintenance.amount>0">{{maintenance.name}} -{{maintenance.amount}}/s</li>
                                </ul>
                            </button>
                            <button class="tooltip" v-if="gameData.research.artistry.completed" @click="buyBuilding(gameData.homeworld.buildings.cultural.workshop)">{{gameData.homeworld.buildings.cultural.workshop.name}}<span class="amount">{{gameData.homeworld.buildings.cultural.workshop.amount}}</span>
                                <ul>
                                    <li>{{gameData.homeworld.buildings.cultural.workshop.title}}</li>
                                    <hr>
                                    <li v-for="c in gameData.homeworld.buildings.cultural.workshop.cost.basic">{{c.name}}: {{c.amount}}</li>
                                    <li v-for="c in gameData.homeworld.buildings.cultural.workshop.cost.luxury">{{c.name}}: {{c.amount}}</li>
                                    <li v-for="c in gameData.homeworld.buildings.cultural.workshop.cost.research">{{c.name}}: {{c.amount}}</li>
                                    <hr>
                                    <li v-for="storage in gameData.homeworld.buildings.cultural.workshop.storage" v-if="storage.amount>0">+{{storage.amount}} Max {{storage.name}}</li>
                                    <hr>
                                    <li v-for="maintenance in gameData.homeworld.buildings.cultural.workshop.maintenance" v-if="maintenance.amount>0">{{maintenance.name}} -{{maintenance.amount}}/s</li>
                                </ul>
                            </button>
                        </div>
                        <div id="industrial">
                            <div v-if="hasBuildings('industrial')">Industrial</div>
                            <button class="tooltip" @click="buyBuilding(gameData.homeworld.buildings.industrial.lumberyard)">{{gameData.homeworld.buildings.industrial.lumberyard.name}}<span class="amount">{{gameData.homeworld.buildings.industrial.lumberyard.amount}}</span>
                                <ul>
                                    <li>{{gameData.homeworld.buildings.industrial.lumberyard.title}}</li>
                                    <hr>
                                    <li v-for="c in gameData.homeworld.buildings.industrial.lumberyard.cost.basic">{{c.name}}: {{c.amount}}</li>
                                    <li v-for="c in gameData.homeworld.buildings.industrial.lumberyard.cost.luxury">{{c.name}}: {{c.amount}}</li>
                                    <li v-for="c in gameData.homeworld.buildings.industrial.lumberyard.cost.research">{{c.name}}: {{c.amount}}</li>
                                    <hr>
                                    <li v-for="storage in gameData.homeworld.buildings.industrial.lumberyard.storage" v-if="storage.amount>0">+{{storage.amount}} Max {{storage.name}}</li>
                                    <hr>
                                    <li v-for="maintenance in gameData.homeworld.buildings.industrial.lumberyard.maintenance" v-if="maintenance.amount>0">{{maintenance.name}} -{{maintenance.amount}}/s</li>
                                </ul>
                            </button>
                            <button class="tooltip" @click="buyBuilding(gameData.homeworld.buildings.industrial.quarry)">{{gameData.homeworld.buildings.industrial.quarry.name}}<span class="amount">{{gameData.homeworld.buildings.industrial.quarry.amount}}</span>
                                <ul>
                                    <li>{{gameData.homeworld.buildings.industrial.quarry.title}}</li>
                                    <hr>
                                    <li v-for="c in gameData.homeworld.buildings.industrial.quarry.cost.basic">{{c.name}}: {{c.amount}}</li>
                                    <li v-for="c in gameData.homeworld.buildings.industrial.quarry.cost.luxury">{{c.name}}: {{c.amount}}</li>
                                    <li v-for="c in gameData.homeworld.buildings.industrial.quarry.cost.research">{{c.name}}: {{c.amount}}</li>
                                    <hr>
                                    <li v-for="storage in gameData.homeworld.buildings.industrial.quarry.storage" v-if="storage.amount>0">+{{storage.amount}} Max {{storage.name}}</li>
                                    <hr>
                                    <li v-for="maintenance in gameData.homeworld.buildings.industrial.quarry.maintenance" v-if="maintenance.amount>0">{{maintenance.name}} -{{maintenance.amount}}/s</li>
                                </ul>
                            </button>
                            <button class="tooltip" v-if="gameData.research.concrete.completed" @click="buyBuilding(gameData.homeworld.buildings.industrial.concreteplant)">{{gameData.homeworld.buildings.industrial.concreteplant.name}}<span class="amount">{{gameData.homeworld.buildings.industrial.concreteplant.amount}}</span>
                                <ul>
                                    <li>{{gameData.homeworld.buildings.industrial.concreteplant.title}}</li>
                                    <hr>
                                    <li v-for="c in gameData.homeworld.buildings.industrial.concreteplant.cost.basic">{{c.name}}: {{c.amount}}</li>
                                    <li v-for="c in gameData.homeworld.buildings.industrial.concreteplant.cost.luxury">{{c.name}}: {{c.amount}}</li>
                                    <li v-for="c in gameData.homeworld.buildings.industrial.concreteplant.cost.research">{{c.name}}: {{c.amount}}</li>
                                    <hr>
                                    <li v-for="storage in gameData.homeworld.buildings.industrial.concreteplant.storage" v-if="storage.amount>0">+{{storage.amount}} Max {{storage.name}}</li>
                                    <hr>
                                    <li v-for="maintenance in gameData.homeworld.buildings.industrial.concreteplant.maintenance" v-if="maintenance.amount>0">{{maintenance.name}} -{{maintenance.amount}}/s</li>
                                </ul>
                            </button>
                            <button class="tooltip" v-if="gameData.research.smelting.completed" @click="buyBuilding(gameData.homeworld.buildings.industrial.smelter)">{{gameData.homeworld.buildings.industrial.smelter.name}}<span class="amount">{{gameData.homeworld.buildings.industrial.smelter.amount}}</span>
                                <ul>
                                    <li>{{gameData.homeworld.buildings.industrial.smelter.title}}</li>
                                    <hr>
                                    <li v-for="c in gameData.homeworld.buildings.industrial.smelter.cost.basic">{{c.name}}: {{c.amount}}</li>
                                    <li v-for="c in gameData.homeworld.buildings.industrial.smelter.cost.luxury">{{c.name}}: {{c.amount}}</li>
                                    <li v-for="c in gameData.homeworld.buildings.industrial.smelter.cost.research">{{c.name}}: {{c.amount}}</li>
                                    <hr>
                                    <li v-for="storage in gameData.homeworld.buildings.industrial.smelter.storage" v-if="storage.amount>0">+{{storage.amount}} Max {{storage.name}}</li>
                                    <hr>
                                    <li v-for="maintenance in gameData.homeworld.buildings.industrial.smelter.maintenance" v-if="maintenance.amount>0">{{maintenance.name}} -{{maintenance.amount}}/s</li>
                                </ul>
                            </button>
                            <button class="tooltip" v-if="gameData.research.barn.completed" @click="buyBuilding(gameData.homeworld.buildings.industrial.barn)">{{gameData.homeworld.buildings.industrial.barn.name}}<span class="amount">{{gameData.homeworld.buildings.industrial.barn.amount}}</span>
                                <ul>
                                    <li>{{gameData.homeworld.buildings.industrial.barn.title}}</li>
                                    <hr>
                                    <li v-for="c in gameData.homeworld.buildings.industrial.barn.cost.basic">{{c.name}}: {{c.amount}}</li>
                                    <li v-for="c in gameData.homeworld.buildings.industrial.barn.cost.luxury">{{c.name}}: {{c.amount}}</li>
                                    <li v-for="c in gameData.homeworld.buildings.industrial.barn.cost.research">{{c.name}}: {{c.amount}}</li>
                                    <hr>
                                    <li v-for="storage in gameData.homeworld.buildings.industrial.barn.storage" v-if="storage.amount>0">+{{storage.amount}} Max {{storage.name}}</li>
                                    <hr>
                                    <li v-for="maintenance in gameData.homeworld.buildings.industrial.barn.maintenance" v-if="maintenance.amount>0">{{maintenance.name}} -{{maintenance.amount}}/s</li>
                                </ul>
                            </button>
                        </div>
                    </section>
                </section>
                <section id="civ" v-if="this.gameData.tabs.civ.selected">
                    <section id="jobs" v-if="this.gameData.tabs.civ.subtabs.jobs.selected">
                        <table>
                            <tr>
                                <td>{{gameData.jobs.unemployed.name}}</td>
                                <td>{{gameData.jobs.unemployed.amount}}</td>
                                <td></td>
                            </tr>
                            <tr v-for="job in gameData.jobs.basic" v-if="job.visable">
                                <td>{{job.name}}</td>
                                <td>{{job.amount}}</td>
                                <td><a @click="changeJob(job, 1)">&#706;+1&#707;</a></td>
                                <td><a @click="changeJob(job, -1)">&#706;-1&#707;</a></td>
                            </tr>
                            <tr v-for="job in gameData.jobs.advanced" v-if="job.visable">
                                <td>{{job.name}}</td>
                                <td>{{job.amount}} / {{job.max}}</td>
                                <td><a v-if="job.max>job.amount" @click="changeJob(job, 1)">&#706;+1&#707;</a></td>
                                <td><a @click="changeJob(job, -1)">&#706;-1&#707;</a></td>
                            </tr>
                        </table>
                    </section>
                    <section id="operators" v-if="this.gameData.tabs.civ.subtabs.operators.selected">
                        <table>
                            <tr>
                                <td>Free {{gameData.jobs.advanced.operator.name}}s</td>
                                <td>{{gameData.jobs.advanced.operator.amount - gameData.jobs.advanced.operator.active}}</td>
                                <td></td>
                            </tr>
                            <tr v-for="job in gameData.jobs.advanced.operator.contraptions" v-if="job.max>0">
                                <td>{{job.name}}</td>
                                <td>{{job.amount}} / {{job.max}}</td>
                                <td><a v-if="job.max>job.amount" @click="operatorJob(job, 1)">&#706;+1&#707;</a></td>
                                <td><a @click="operatorJob(job, -1)">&#706;-1&#707;</a></td>
                            </tr>
                        </table>
                    </section>
                </section>
                <section id="research" v-if="this.gameData.tabs.research.selected">
                    <section id="new" v-if="this.gameData.tabs.research.subtabs.new.selected">
                        <ul>
                            <li class="tooltip" v-for="r in gameData.research" v-if="!r.completed && r.visable"><a @click="completeResearch(r)">{{r.name}}</a>
                                <ul>
                                    <li>{{r.name}}</li>
                                    <hr>
                                    <li v-for="c in r.cost.basic">{{c.name}}: {{c.amount}}</li>
                                    <li v-for="c in r.cost.luxury">{{c.name}}: {{c.amount}}</li>
                                    <li v-for="c in r.cost.research">{{c.name}}: {{c.amount}}</li>
                                    <hr>
                                    {{r.desc}}
                                </ul>
                            </li>
                        </ul>
                    </section>
                    <section id="completed" v-if="this.gameData.tabs.research.subtabs.completed.selected">
                        <ul>
                            <li class="tooltip" v-for="r in gameData.research" v-if="r.completed">{{r.name}}
                                <ul>
                                    <li>{{r.name}}</li>
                                    <hr>
                                    {{r.desc}}
                                </ul>
                            </li>
                        </ul>
                    </section>
                </section>
                <section id="achievements" v-if="this.gameData.tabs.achievements.selected">
                    <ul>
                        <li class="tooltip" v-for="a in gameData.achievements" v-if="a.achieved">{{a.name}}
                            <ul>
                                <li>{{a.name}}</li>
                                <hr>
                                {{a.desc}}
                            </ul>
                        </li>
                    </ul>
                </section>
                <section id="options" v-if="this.gameData.tabs.options.selected">
                    <button @click="clearSave()">Hard Reset</button>
                    <button @click="manualSave()">Manual Save</button>
                </section>
            </section>
            <section id="event-section">

            </section>
        </section>`,
        methods: {
            clearSave: function() {
                if(confirm("Are you sure you want to deleate your save?") == true)
                {
                    if(confirm("Are you really sure you want to deleate your save?") == true)
                    {
                        if(confirm("Last chance, are you really sure you want to deleate your save?") == true)
                        {
                            localStorage.removeItem("saveData");
                            location.reload();
                        }
                    }
                }
            },
            manualSave: function() {
                let saveData = JSON.stringify(this.gameData);
                localStorage.setItem("saveData", saveData);
                console.log("Manually saved!")
            },
            hasBuildings: function(id) {
                let title = document.getElementById(id);
                if(title == null) return false;
                if(title.childElementCount == 0) return false;
                return true;
            },
            notEnoughResource: function(r, c) {
                return false;
            },
            selectTab: function(id) {
                for(var t in this.gameData.tabs)
                {
                    if(this.gameData.tabs[t] == id)
                    {
                        this.gameData.tabs[t].selected = true;
                    }
                    else
                    {
                        this.gameData.tabs[t].selected = false;
                    }
                }
            },
            selectSubTab: function(tab, id) {
                for(var t in tab.subtabs)
                {
                    if(tab.subtabs[t] == id)
                    {
                        tab.subtabs[t].selected = true;
                    }
                    else
                    {
                        tab.subtabs[t].selected = false;
                    }
                }
            },
            awardAchievement: function(id) {
                this.gameData.tabs.achievements.visable = true;
                if(!id.achieved)
                {
                    id.achieved = true;
                    let section = document.getElementById('event-section');
                    let div = document.createElement('div');
                    let p = document.createElement('p');
                    p.textContent = "Gained Achievement: " + id.name;
                    div.append(p);
                    if(section != null) section.prepend(div);
                }
            },
            unlockResource: function(id) {
                if(id.visable == false)
                {
                    if(id == this.gameData.resources.population)
                    {
                        this.gameData.tabs.civ.visable = true;
                        this.gameData.tabs.civ.subtabs.jobs.visable = true;
                    }
                    if(id.type == "Research")
                    {
                        this.gameData.tabs.research.visable = true;
                    }
                    id.visable = true;
                }
            },
            gather: function(id) {
                this.increaseResource(id, 1);
            },
            increaseResource: function(id, amount) {
                var a = 0;
                if(amount > 0)
                {
                    a = Math.min(id.max - id.amount, amount);
                }
                else
                {
                    a = id.amount + amount >= 0 ? amount : amount - (id.amount + amount);
                }
                if(a > 0){this.unlockResource(id)}
                if(id.type == "Population"){
                    this.gameData.jobs.unemployed.amount+=a;
                }
                id.amount += a;
            },
            tickEvents: function() {
                if(this.gameData.runinfo.ticks%40==0)
                {
                    console.log("A day has passed")
                    let section = document.getElementById('event-section');
                    //Daily
                    let custom = this.gameData.events.custom;
                    //New Pop
                    if(this.gameData.resources.population.max>0 && this.gameData.resources.population.max != this.gameData.resources.population.amount)
                    {
                        let chance = Math.random()
                        if(chance <= custom.increasePop.current)
                        {
                            this.increaseResource(this.gameData.resources.population, 1);
                            custom.increasePop.current = custom.increasePop.min;
                        }
                        else
                        {
                            custom.increasePop.current = Math.min(custom.increasePop.max, custom.increasePop.current+custom.increasePop.increase);
                        }
                    }
                    
                    let d = this.gameData.events.daily;
                    //HunetFindStuff
                    if(Math.random() <= d.hunterFindStuff.current)
                    {
                        let msg = document.createElement('p')
                        msg.textContent = d.hunterFindStuff.msg;
                        let msgDiv = document.createElement('div')
                        msgDiv.append(msg);
                        for(let t in d.hunterFindStuff.stuff)
                        {
                            for(let r in d.hunterFindStuff.stuff[t])
                            {
                                let amount = this.getRandomInt(d.hunterFindStuff.stuff[t][r].max, d.hunterFindStuff.stuff[t][r].min)
                                msg = document.createElement('p')
                                msg.textContent = "+"+amount+" "+this.gameData.resources[t][r].name;
                                this.increaseResource(this.gameData.resources[t][r], amount);
                                msgDiv.append(msg);
                            }
                        }
                        d.hunterFindStuff.current = d.hunterFindStuff.min;
                        this.awardAchievement(this.gameData.achievements.shinyrock);
                        if(section != null) section.prepend(msgDiv);
                    }
                    else
                    {
                        d.hunterFindStuff.current = Math.min(d.hunterFindStuff.max, d.hunterFindStuff.current+Math.min(0.01, d.hunterFindStuff.increase*this.logBase(1+this.gameData.jobs.basic.hunter.amount,4)));
                    }
                    //Starve
                    if(this.gameData.resources.population.starve>0 && this.gameData.resources.population.amount > 0)
                    {
                        if(Math.random() <= d.starve.current)
                        {
                            let msg = document.createElement('p')
                            msg.textContent = d.starve.msg;
                            let msgDiv = document.createElement('div')
                            msgDiv.append(msg);
                            this.killRandomPop();
                            this.gameData.resources.population.starve -= 100;
                            if(section != null) section.prepend(msgDiv);
                        }
                        else
                        {
                            d.starve.current = Math.min(d.starve.max, d.starve.current + d.starve.increase);
                        }
                    }
                    else
                    {
                        d.starve.current = 0;
                    }
                    
                    //Start Season
                    if(Math.floor(this.gameData.runinfo.time%365)==0||Math.floor(this.gameData.runinfo.time%365)==91||Math.floor(this.gameData.runinfo.time%365)==183||Math.floor(this.gameData.runinfo.time%365)==274)
                    {
                        console.log("A Season Has Passed!")
                        let s = this.gameData.events.seasonal;
                        let seasonDiv = document.createElement('div');
                        let seasonP = document.createElement('p');
                        seasonP.textContent = Math.floor(this.gameData.runinfo.time%365)==0 ? "It's Now Spring" : Math.floor(this.gameData.runinfo.time%365)==91 ? "It's Now Summer" : Math.floor(this.gameData.runinfo.time%365)==183 ? "It's Now Autumn" : "It's Now Winter";
                        seasonDiv.append(seasonP);
                        if(section != null) section.prepend(seasonDiv);
                    }
                    //Start Year
                    if(Math.floor(this.gameData.runinfo.time%365)==0)
                    {
                        let y = this.gameData.events.yearly;
                        
                    }
                }
            },
            tickContraptions: function() {
                let contraptions = this.gameData.jobs.advanced.operator.contraptions;
                for(let c in contraptions)
                {
                    for (let index = 0; index < contraptions[c].amount; index++) 
                    {
                        let enough = true
                        for(let t in contraptions[c].cost)
                        {
                            for(let r in contraptions[c].cost[t])
                            {
                                let resource = this.gameData.resources[t][r];
                                if(contraptions[c].cost[t][r].amount + resource.loss - resource.gain > resource.amount) enough = false;
                            }
                        }
                        if(!enough) continue;
                        for(let t in contraptions[c].cost)
                        {
                            for(let r in contraptions[c].cost[t])
                            {
                                this.gameData.resources[t][r].loss += contraptions[c].cost[t][r].amount;
                            }
                        }
                        for(let t in contraptions[c].produce)
                        {
                            for(let r in contraptions[c].produce[t])
                            {
                                this.gameData.resources[t][r].produce += contraptions[c].produce[t][r].amount;
                            }
                        }
                    }
                }
            },
            tickResources: function() {
                if(this.gameData.resources.money.gain > 0){this.unlockResource(this.gameData.resources.money)}
                this.increaseResource(this.gameData.resources.money, (this.gameData.resources.money.gain-this.gameData.resources.money.loss)*this.gameData.tick/1000);
                for (var e in this.gameData.resources.research) {
                    if(this.gameData.resources.research[e].gain > 0){this.unlockResource(this.gameData.resources.research[e])}
                    this.increaseResource(this.gameData.resources.research[e], (this.gameData.resources.research[e].gain-this.gameData.resources.research[e].loss)*this.gameData.tick/1000);
                }
                for (var e in this.gameData.resources.basic) {
                    if(this.gameData.resources.basic[e].gain > 0){this.unlockResource(this.gameData.resources.basic[e])}
                    this.increaseResource(this.gameData.resources.basic[e], (this.gameData.resources.basic[e].gain-this.gameData.resources.basic[e].loss)*this.gameData.tick/1000);
                }
                for (var e in this.gameData.resources.luxury) {
                    if(this.gameData.resources.luxury[e].gain > 0){this.unlockResource(this.gameData.resources.luxury[e])}
                    this.increaseResource(this.gameData.resources.luxury[e], (this.gameData.resources.luxury[e].gain-this.gameData.resources.luxury[e].loss)*this.gameData.tick/1000);
                }
            },
            tickTime: function() {
                this.gameData.runinfo.ticks++;
                if(this.gameData.runinfo.ticks%40==0)
                {
                    this.gameData.universe.time++;
                    this.gameData.runinfo.time++;
                }
            },
            allChange: function() {
                this.resetGain();
                this.moneyChange();
                this.faithChange();
                this.knowledgeChange();
                this.cultureChange();
                this.foodChange();
                this.woodChange();
                this.stoneChange();
                this.concreteChange();
                this.oreChange();
                this.copperChange();
                this.coalChange();
                this.goldChange();
                this.ironChange();
                this.furChange();
                this.spiceChange();
                this.applyWorkerMultipliers();

                this.tickContraptions();
                this.applyContraptionMultipliers();

                this.applyGlobalMultipliers();

                this.tickPopulationStuff();
                this.moraleCalc();
            },
            resetGain: function() {
                for(let t in this.gameData.resources)
                {
                    if(t == "population")
                    {
                        continue;
                    }
                    else if(t == "money")
                    {
                        this.gameData.resources[t].gain = 0;
                    }
                    else
                    {
                        for(let r in this.gameData.resources[t])
                        {
                            this.gameData.resources[t][r].gain = 0;
                        }
                    }
                }
            },
            applyWorkerMultipliers: function() {
                for(let t in this.gameData.resources)
                {
                    if(t == "population")
                    {
                        continue;
                    }
                    else if(t == "money")
                    {
                        let gain = 0 + this.gameData.resources[t].gain>this.gameData.resources[t].produce ? this.gameData.resources[t].gain : this.gameData.resources[t].produce;
                        for(let m in this.gameData.resources[t].multipliers)
                        {
                            if(m in this.gameData.multipliers.workers) gain *= this.gameData.multipliers.workers[m].amount;
                        }

                        this.gameData.resources[t].gain = gain;
                    }
                    else
                    {
                        for(let r in this.gameData.resources[t])
                        {
                            let gain = 0 + this.gameData.resources[t][r].gain>this.gameData.resources[t][r].produce ? this.gameData.resources[t][r].gain : this.gameData.resources[t][r].produce;
                            for(let m in this.gameData.resources[t][r].multipliers)
                            {
                                if(m in this.gameData.multipliers.workers) gain *= this.gameData.multipliers.workers[m].amount;
                            }
                            
                            this.gameData.resources[t][r].gain = gain;
                        }
                    }
                }
            },
            applyContraptionMultipliers: function() {
                for(let t in this.gameData.resources)
                {
                    if(t == "population")
                    {
                        continue;
                    }
                    else if(t == "money")
                    {
                        let gain = 0 + this.gameData.resources[t].gain>this.gameData.resources[t].produce ? this.gameData.resources[t].gain : this.gameData.resources[t].produce;
                        for(let m in this.gameData.resources[t].multipliers)
                        {
                            if(m in this.gameData.multipliers.contraptions) gain *= this.gameData.multipliers.contraptions[m].amount;
                        }

                        this.gameData.resources[t].gain = gain;
                    }
                    else
                    {
                        for(let r in this.gameData.resources[t])
                        {
                            let gain = 0 + this.gameData.resources[t][r].gain>this.gameData.resources[t][r].produce ? this.gameData.resources[t][r].gain : this.gameData.resources[t][r].produce;
                            for(let m in this.gameData.resources[t][r].multipliers)
                            {
                                if(m in this.gameData.multipliers.contraptions) gain *= this.gameData.multipliers.contraptions[m].amount;
                            }
                            
                            this.gameData.resources[t][r].gain = gain;
                        }
                    }
                }
            },
            applyGlobalMultipliers: function() {
                for(let t in this.gameData.resources)
                {
                    if(t == "population")
                    {
                        continue;
                    }
                    else if(t == "money")
                    {
                        let gain = 0 + this.gameData.resources[t].gain>this.gameData.resources[t].produce ? this.gameData.resources[t].gain : this.gameData.resources[t].produce;
                        for(let m in this.gameData.resources[t].multipliers)
                        {
                            if(m in this.gameData.multipliers.everything) gain *= this.gameData.multipliers.everything[m].amount;
                        }
                        gain *= this.achievementMult();
                        this.gameData.resources[t].gain = gain;
                    }
                    else
                    {
                        for(let r in this.gameData.resources[t])
                        {
                            let gain = 0 + this.gameData.resources[t][r].gain>this.gameData.resources[t][r].produce ? this.gameData.resources[t][r].gain : this.gameData.resources[t][r].produce;
                            for(let m in this.gameData.resources[t][r].multipliers)
                            {
                                if(m in this.gameData.multipliers.everything) gain *= this.gameData.multipliers.everything[m].amount;
                            }
                            
                            gain *= this.achievementMult();
                            this.gameData.resources[t][r].gain = gain;
                        }
                    }
                }
            },
            achievementMult: function() {
                let mult = 1;
                for(let a in this.gameData.achievements)
                {
                    if(this.gameData.achievements[a].achieved) mult *= 1.005;
                }
                return mult;
            },
            moneyChange: function() {
                if(false) //Research Money
                {
                    var gain = 0;
                    var loss = 0;
                    var max = 100;

                    //Gain
                    gain += this.gameData.resources.population.amount*this.gameData.resources.population.taxes;

                    //Loss

                    //Max
                    for(var b in this.gameData.homeworld.buildings)
                    {
                        for(var res in this.gameData.homeworld.buildings[b])
                        {
                            if('storage' in this.gameData.homeworld.buildings[b][res] && 'money' in this.gameData.homeworld.buildings[b][res].storage)
                            {
                                max += this.gameData.homeworld.buildings[b][res].storage.money.amount*this.gameData.homeworld.buildings[b][res].amount;
                            }
                        }
                    }

                    //Mult
                    this.gameData.resources.money.produce = gain;
                    this.gameData.resources.money.loss = loss;
                    this.gameData.resources.money.max = max;
                }
            },
            moraleCalc: function() {
                var gain = 0;
                var loss = 0;
                var max = 150;
                var pop = this.gameData.resources.population.amount;
                
                if(pop > 0)
                {
                    //Gain
                    gain += this.gameData.research.dogs2.completed ? 30 : 0;
                    gain += this.gameData.research.accessories.completed ? 15 : 0;
                    gain += this.gameData.research.roads.completed ? 10 : 0;
                    gain += this.gameData.research.roads3.completed ? 5 : 0;
                    for(var l in this.gameData.resources.luxury)
                    {
                        if(this.gameData.resources.luxury[l].amount > 0)
                        {
                            gain += 10;
                        }
                    }

                    //Loss
                    loss += Math.min(50, Math.floor(this.gameData.resources.population.starve)/13);
                    loss += pop <= 4 ? 0 : this.logBase(pop-4, 7);
                    loss += pop <= 14 ? 0 : this.logBase(pop-14, 6);
                    loss += pop <= 34 ? 0 : this.logBase(pop-34, 5);
                    loss += pop <= 149 ? 0 : this.logBase(pop-149, 4);
                    loss += pop <= 499 ? 0 : this.logBase(pop-499, 3);
                    loss += pop <= 1499 ? 0 : this.logBase(pop-1499, 2);
                }

                //Max
                max += this.gameData.research.dogs2.completed ? 30 : 0;

                this.gameData.resources.morale.amount = 100 + gain - loss;
                this.gameData.resources.morale.max = max
                this.gameData.resources.morale.effective = Math.max(0, Math.min(this.gameData.resources.morale.amount, this.gameData.resources.morale.max));
                this.gameData.multipliers.contraptions.morale.amount = 1+(this.gameData.resources.morale.effective-100)*0.005;
            },
            faithChange: function() {
                var gain = 0;
                var loss = 0;
                var max = 100;

                //Gain
                gain += this.gameData.jobs.advanced.priest.amount*this.gameData.jobs.advanced.priest.faithGain*this.gameData.jobs.advanced.priest.toolMult;

                //Loss

                //Max
                for(var b in this.gameData.homeworld.buildings)
                {
                    for(var res in this.gameData.homeworld.buildings[b])
                    {
                        if('storage' in this.gameData.homeworld.buildings[b][res] && 'faith' in this.gameData.homeworld.buildings[b][res].storage)
                        {
                            max += this.gameData.homeworld.buildings[b][res].storage.faith.amount*this.gameData.homeworld.buildings[b][res].amount;
                        }
                    }
                }

                //Mult
                this.gameData.resources.research.faith.produce = gain;
                this.gameData.resources.research.faith.loss = loss;
                this.gameData.resources.research.faith.max = max;
            },
            knowledgeChange: function() {
                var gain = 0;
                var loss = 0;
                var max = 100;

                //Gain
                gain += this.gameData.jobs.advanced.scholar.amount*this.gameData.jobs.advanced.scholar.knowledgeGain*this.gameData.jobs.advanced.scholar.toolMult;
                
                //Loss

                //Max
                for(var b in this.gameData.homeworld.buildings)
                {
                    for(var res in this.gameData.homeworld.buildings[b])
                    {
                        if('storage' in this.gameData.homeworld.buildings[b][res] && 'knowledge' in this.gameData.homeworld.buildings[b][res].storage)
                        {
                            max += this.gameData.homeworld.buildings[b][res].storage.knowledge.amount*this.gameData.homeworld.buildings[b][res].amount;
                        }
                    }
                }
                max += this.gameData.resources.population.education*this.gameData.resources.population.amount;

                //Mult
                this.gameData.resources.research.knowledge.produce = gain;
                this.gameData.resources.research.knowledge.loss = loss;
                this.gameData.resources.research.knowledge.max = max;
            },
            cultureChange: function() {
                var gain = 0;
                var loss = 0;
                var max = 100;

                //Gain
                gain += this.gameData.jobs.advanced.scholar.amount*this.gameData.jobs.advanced.scholar.cultureGain*this.gameData.jobs.advanced.scholar.toolMult;
                gain += this.gameData.jobs.advanced.priest.amount*this.gameData.jobs.advanced.priest.cultureGain*this.gameData.jobs.advanced.priest.toolMult;
                
                //Loss

                //Max
                for(var b in this.gameData.homeworld.buildings)
                {
                    for(var res in this.gameData.homeworld.buildings[b])
                    {
                        if('storage' in this.gameData.homeworld.buildings[b][res] && 'culture' in this.gameData.homeworld.buildings[b][res].storage)
                        {
                            max += this.gameData.homeworld.buildings[b][res].storage.culture.amount*this.gameData.homeworld.buildings[b][res].amount;
                        }
                    }
                }
                max += this.gameData.resources.population.cultured*this.gameData.resources.population.amount;

                //Mult
                this.gameData.resources.research.culture.produce = gain;
                this.gameData.resources.research.culture.loss = loss;
                this.gameData.resources.research.culture.max = max;
            },
            foodChange: function() {
                var gain = 0;
                var loss = 0;
                var max = 100;

                //Gain
                gain += this.gameData.jobs.basic.hunter.amount*this.gameData.jobs.basic.hunter.foodGain*this.gameData.jobs.basic.hunter.toolMult;
                var farmerSeasonMult = (this.gameData.runinfo.time%365) < 92 ? this.gameData.jobs.basic.farmer.spring : 
                    this.gameData.runinfo.time%365 < 184 ? this.gameData.jobs.basic.farmer.summer :
                    this.gameData.runinfo.time%365 < 275 ? this.gameData.jobs.basic.farmer.autumn :
                    this.gameData.jobs.basic.farmer.winter;
                gain += this.gameData.jobs.basic.farmer.amount*farmerSeasonMult*this.gameData.jobs.basic.farmer.toolMult;
                gain += this.gameData.jobs.basic.farmer.amount*this.gameData.jobs.basic.farmer.cattle;

                //Loss
                loss += this.gameData.resources.population.amount*this.gameData.resources.population.food;
                loss += this.gameData.jobs.unemployed.amount*this.gameData.jobs.unemployed.food;
                for(var job in this.gameData.jobs.basic)
                {
                    loss += this.gameData.jobs.basic[job].amount*this.gameData.jobs.basic[job].food;
                }
                for(var job in this.gameData.jobs.advanced)
                {
                    loss += this.gameData.jobs.advanced[job].amount*this.gameData.jobs.advanced[job].food;
                }

                //Max
                for(var b in this.gameData.homeworld.buildings)
                {
                    for(var res in this.gameData.homeworld.buildings[b])
                    {
                        if('storage' in this.gameData.homeworld.buildings[b][res] && 'food' in this.gameData.homeworld.buildings[b][res].storage)
                        {
                            max += this.gameData.homeworld.buildings[b][res].storage.food.amount*this.gameData.homeworld.buildings[b][res].amount;
                        }
                    }
                }

                //Mult
                this.gameData.resources.basic.food.produce = gain;
                this.gameData.resources.basic.food.loss = loss;
                this.gameData.resources.basic.food.max = max;
            },
            woodChange: function() {
                var gain = 0;
                var loss = 0;
                var max = 100;

                //Gain
                var lumberjackMax = this.gameData.homeworld.buildings.industrial.lumberyard.amount*this.gameData.homeworld.buildings.industrial.lumberyard.workers;
                gain += this.gameData.jobs.basic.lumberjack.amount <= lumberjackMax ?
                    this.gameData.jobs.basic.lumberjack.amount*this.gameData.jobs.basic.lumberjack.woodGain*this.gameData.jobs.basic.lumberjack.toolMult : 
                    (lumberjackMax*this.gameData.jobs.basic.lumberjack.woodGain + (this.gameData.jobs.basic.lumberjack.amount-lumberjackMax)*this.gameData.jobs.basic.lumberjack.woodGainEx)*this.gameData.jobs.basic.lumberjack.toolMult;

                //Loss
                for(var b in this.gameData.homeworld.buildings)
                {
                    for(var res in this.gameData.homeworld.buildings[b])
                    {
                        if('wood' in this.gameData.homeworld.buildings[b][res].maintenance)
                        {
                            loss += this.gameData.homeworld.buildings[b][res].maintenance.wood.amount*this.gameData.homeworld.buildings[b][res].amount;
                        }
                    }
                }

                //Max
                for(var b in this.gameData.homeworld.buildings)
                {
                    for(var res in this.gameData.homeworld.buildings[b])
                    {
                        if('storage' in this.gameData.homeworld.buildings[b][res] && 'wood' in this.gameData.homeworld.buildings[b][res].storage)
                        {
                            max += this.gameData.homeworld.buildings[b][res].storage.wood.amount*this.gameData.homeworld.buildings[b][res].amount;
                        }
                    }
                }

                //Mult
                this.gameData.resources.basic.wood.produce = gain;
                this.gameData.resources.basic.wood.loss = loss;
                this.gameData.resources.basic.wood.max = max;
            },
            stoneChange: function() {
                var gain = 0;
                var loss = 0;
                var max = 100;

                //Gain
                var quarryMax = this.gameData.homeworld.buildings.industrial.quarry.amount*this.gameData.homeworld.buildings.industrial.quarry.workers;
                gain += this.gameData.jobs.basic.quarry_worker.amount <= quarryMax ?
                    this.gameData.jobs.basic.quarry_worker.amount*this.gameData.jobs.basic.quarry_worker.stoneGain*this.gameData.jobs.basic.quarry_worker.toolMult : 
                    (quarryMax*this.gameData.jobs.basic.quarry_worker.stoneGain + (this.gameData.jobs.basic.quarry_worker.amount-quarryMax)*this.gameData.jobs.basic.quarry_worker.stoneGainEx)*this.gameData.jobs.basic.quarry_worker.toolMult;

                //Loss
                for(var b in this.gameData.homeworld.buildings)
                {
                    for(var res in this.gameData.homeworld.buildings[b])
                    {
                        if('stone' in this.gameData.homeworld.buildings[b][res].maintenance)
                        {
                            loss += this.gameData.homeworld.buildings[b][res].maintenance.stone.amount*this.gameData.homeworld.buildings[b][res].amount;
                        }
                    }
                }

                //Max
                for(var b in this.gameData.homeworld.buildings)
                {
                    for(var res in this.gameData.homeworld.buildings[b])
                    {
                        if('storage' in this.gameData.homeworld.buildings[b][res] && 'stone' in this.gameData.homeworld.buildings[b][res].storage)
                        {
                            max += this.gameData.homeworld.buildings[b][res].storage.stone.amount*this.gameData.homeworld.buildings[b][res].amount;
                        }
                    }
                }

                //Mult
                this.gameData.resources.basic.stone.produce = gain;
                this.gameData.resources.basic.stone.loss = loss;
                this.gameData.resources.basic.stone.max = max;
            },
            concreteChange: function() {
                var gain = 0;
                var loss = 0;
                var max = 100;

                //Gain

                //Loss
                for(var b in this.gameData.homeworld.buildings)
                {
                    for(var res in this.gameData.homeworld.buildings[b])
                    {
                        if('concrete' in this.gameData.homeworld.buildings[b][res].maintenance)
                        {
                            loss += this.gameData.homeworld.buildings[b][res].maintenance.concrete.amount*this.gameData.homeworld.buildings[b][res].amount;
                        }
                    }
                }

                //Max
                for(var b in this.gameData.homeworld.buildings)
                {
                    for(var res in this.gameData.homeworld.buildings[b])
                    {
                        if('storage' in this.gameData.homeworld.buildings[b][res] && 'concrete' in this.gameData.homeworld.buildings[b][res].storage)
                        {
                            max += this.gameData.homeworld.buildings[b][res].storage.concrete.amount*this.gameData.homeworld.buildings[b][res].amount;
                        }
                    }
                }

                //Mult
                this.gameData.resources.basic.concrete.produce = gain;
                this.gameData.resources.basic.concrete.loss = loss;
                this.gameData.resources.basic.concrete.max = max;
            },
            oreChange: function() {
                var gain = 0;
                var loss = 0;
                var max = 100;

                //Gain
                var quarryMax = this.gameData.homeworld.buildings.industrial.quarry.amount*this.gameData.homeworld.buildings.industrial.quarry.workers;
                gain += this.gameData.jobs.basic.quarry_worker.amount <= quarryMax ?
                    this.gameData.jobs.basic.quarry_worker.amount*this.gameData.jobs.basic.quarry_worker.oreGain*this.gameData.jobs.basic.quarry_worker.toolMult : 
                    (quarryMax*this.gameData.jobs.basic.quarry_worker.oreGain + (this.gameData.jobs.basic.quarry_worker.amount-quarryMax)*this.gameData.jobs.basic.quarry_worker.oreGainEx)*this.gameData.jobs.basic.quarry_worker.toolMult;
                
                //Loss
                for(var b in this.gameData.homeworld.buildings)
                {
                    for(var res in this.gameData.homeworld.buildings[b])
                    {
                        if('ore' in this.gameData.homeworld.buildings[b][res].maintenance)
                        {
                            loss += this.gameData.homeworld.buildings[b][res].maintenance.copper.amount*this.gameData.homeworld.buildings[b][res].amount;
                        }
                    }
                }

                //Max
                for(var b in this.gameData.homeworld.buildings)
                {
                    for(var res in this.gameData.homeworld.buildings[b])
                    {
                        if('storage' in this.gameData.homeworld.buildings[b][res] && 'ore' in this.gameData.homeworld.buildings[b][res].storage)
                        {
                            max += this.gameData.homeworld.buildings[b][res].storage.ore.amount*this.gameData.homeworld.buildings[b][res].amount;
                        }
                    }
                }

                //Mult
                this.gameData.resources.basic.ore.produce = gain;
                this.gameData.resources.basic.ore.loss = loss;
                this.gameData.resources.basic.ore.max = max;
            },
            copperChange: function() {
                var gain = 0;
                var loss = 0;
                var max = 100;

                //Gain
                
                //Loss
                for(var b in this.gameData.homeworld.buildings)
                {
                    for(var res in this.gameData.homeworld.buildings[b])
                    {
                        if('copper' in this.gameData.homeworld.buildings[b][res].maintenance)
                        {
                            loss += this.gameData.homeworld.buildings[b][res].maintenance.copper.amount*this.gameData.homeworld.buildings[b][res].amount;
                        }
                    }
                }

                //Max
                for(var b in this.gameData.homeworld.buildings)
                {
                    for(var res in this.gameData.homeworld.buildings[b])
                    {
                        if('storage' in this.gameData.homeworld.buildings[b][res] && 'copper' in this.gameData.homeworld.buildings[b][res].storage)
                        {
                            max += this.gameData.homeworld.buildings[b][res].storage.copper.amount*this.gameData.homeworld.buildings[b][res].amount;
                        }
                    }
                }

                //Mult
                this.gameData.resources.basic.copper.produce = gain;
                this.gameData.resources.basic.copper.loss = loss;
                this.gameData.resources.basic.copper.max = max;
            },
            coalChange: function() {
                var gain = 0;
                var loss = 0;
                var max = 100;

                //Gain
                var quarryMax = this.gameData.homeworld.buildings.industrial.quarry.amount*this.gameData.homeworld.buildings.industrial.quarry.workers;
                gain += this.gameData.jobs.basic.quarry_worker.amount <= quarryMax ?
                    this.gameData.jobs.basic.quarry_worker.amount*this.gameData.jobs.basic.quarry_worker.oreGain*this.gameData.jobs.basic.quarry_worker.toolMult : 
                    (quarryMax*this.gameData.jobs.basic.quarry_worker.oreGain + (this.gameData.jobs.basic.quarry_worker.amount-quarryMax)*this.gameData.jobs.basic.quarry_worker.oreGainEx)*this.gameData.jobs.basic.quarry_worker.toolMult;
                
                //Loss
                for(var b in this.gameData.homeworld.buildings)
                {
                    for(var res in this.gameData.homeworld.buildings[b])
                    {
                        if('coal' in this.gameData.homeworld.buildings[b][res].maintenance)
                        {
                            loss += this.gameData.homeworld.buildings[b][res].maintenance.coal.amount*this.gameData.homeworld.buildings[b][res].amount;
                        }
                    }
                }

                //Max
                for(var b in this.gameData.homeworld.buildings)
                {
                    for(var res in this.gameData.homeworld.buildings[b])
                    {
                        if('storage' in this.gameData.homeworld.buildings[b][res] && 'coal' in this.gameData.homeworld.buildings[b][res].storage)
                        {
                            max += this.gameData.homeworld.buildings[b][res].storage.coal.amount*this.gameData.homeworld.buildings[b][res].amount;
                        }
                    }
                }

                //Mult
                this.gameData.resources.basic.coal.produce = gain;
                this.gameData.resources.basic.coal.loss = loss;
                this.gameData.resources.basic.coal.max = max;
            },
            goldChange: function() {
                var gain = 0;
                var loss = 0;
                var max = 100;

                //Gain
                
                //Loss
                for(var b in this.gameData.homeworld.buildings)
                {
                    for(var res in this.gameData.homeworld.buildings[b])
                    {
                        if('gold' in this.gameData.homeworld.buildings[b][res].maintenance)
                        {
                            loss += this.gameData.homeworld.buildings[b][res].maintenance.gold.amount*this.gameData.homeworld.buildings[b][res].amount;
                        }
                    }
                }

                //Max
                for(var b in this.gameData.homeworld.buildings)
                {
                    for(var res in this.gameData.homeworld.buildings[b])
                    {
                        if('storage' in this.gameData.homeworld.buildings[b][res] && 'gold' in this.gameData.homeworld.buildings[b][res].storage)
                        {
                            max += this.gameData.homeworld.buildings[b][res].storage.gold.amount*this.gameData.homeworld.buildings[b][res].amount;
                        }
                    }
                }

                //Mult
                this.gameData.resources.basic.gold.produce = gain;
                this.gameData.resources.basic.gold.loss = loss;
                this.gameData.resources.basic.gold.max = max;
            },
            ironChange: function() {
                var gain = 0;
                var loss = 0;
                var max = 100;

                //Gain
                
                //Loss
                for(var b in this.gameData.homeworld.buildings)
                {
                    for(var res in this.gameData.homeworld.buildings[b])
                    {
                        if('iron' in this.gameData.homeworld.buildings[b][res].maintenance)
                        {
                            loss += this.gameData.homeworld.buildings[b][res].maintenance.iron.amount*this.gameData.homeworld.buildings[b][res].amount;
                        }
                    }
                }

                //Max
                for(var b in this.gameData.homeworld.buildings)
                {
                    for(var res in this.gameData.homeworld.buildings[b])
                    {
                        if('storage' in this.gameData.homeworld.buildings[b][res] && 'iron' in this.gameData.homeworld.buildings[b][res].storage)
                        {
                            max += this.gameData.homeworld.buildings[b][res].storage.iron.amount*this.gameData.homeworld.buildings[b][res].amount;
                        }
                    }
                }

                //Mult
                this.gameData.resources.basic.iron.produce = gain;
                this.gameData.resources.basic.iron.loss = loss;
                this.gameData.resources.basic.iron.max = max;
            },
            furChange: function() {
                var gain = 0;
                var loss = 0;
                var max = 100;

                //Gain
                gain += this.gameData.jobs.basic.hunter.amount*this.gameData.jobs.basic.hunter.furGain*this.gameData.jobs.basic.hunter.toolMult;
                gain += this.gameData.jobs.basic.farmer.amount*this.gameData.jobs.basic.farmer.cattle;
                
                //Loss
                loss += this.gameData.resources.population.amount*this.gameData.resources.population.luxury;
                for(var b in this.gameData.homeworld.buildings)
                {
                    for(var res in this.gameData.homeworld.buildings[b])
                    {
                        if('fur' in this.gameData.homeworld.buildings[b][res].maintenance)
                        {
                            loss += this.gameData.homeworld.buildings[b][res].maintenance.fur.amount*this.gameData.homeworld.buildings[b][res].amount;
                        }
                    }
                }

                //Max
                for(var b in this.gameData.homeworld.buildings)
                {
                    for(var res in this.gameData.homeworld.buildings[b])
                    {
                        if('storage' in this.gameData.homeworld.buildings[b][res] && 'fur' in this.gameData.homeworld.buildings[b][res].storage)
                        {
                            max += this.gameData.homeworld.buildings[b][res].storage.fur.amount*this.gameData.homeworld.buildings[b][res].amount;
                        }
                    }
                }

                //Mult
                this.gameData.resources.luxury.fur.produce = gain;
                this.gameData.resources.luxury.fur.loss = loss;
                this.gameData.resources.luxury.fur.max = max;
            },
            spiceChange: function() {
                var gain = 0;
                var loss = 0;
                var max = 100;

                //Gain
                var farmerSeasonMult = (this.gameData.runinfo.time%365) < 92 ? this.gameData.jobs.basic.farmer.spring : 
                    this.gameData.runinfo.time%365 < 184 ? this.gameData.jobs.basic.farmer.summer :
                    this.gameData.runinfo.time%365 < 275 ? this.gameData.jobs.basic.farmer.autumn :
                    this.gameData.jobs.basic.farmer.winter;
                gain += this.gameData.jobs.basic.farmer.amount*farmerSeasonMult*this.gameData.jobs.basic.farmer.toolMult*this.gameData.jobs.basic.farmer.spice;

                //Loss
                loss += this.gameData.resources.population.amount*this.gameData.resources.population.luxury;
                for(var b in this.gameData.homeworld.buildings)
                {
                    for(var res in this.gameData.homeworld.buildings[b])
                    {
                        if('spice' in this.gameData.homeworld.buildings[b][res].maintenance)
                        {
                            loss += this.gameData.homeworld.buildings[b][res].maintenance.spice.amount*this.gameData.homeworld.buildings[b][res].amount;
                        }
                    }
                }

                //Max
                for(var b in this.gameData.homeworld.buildings)
                {
                    for(var res in this.gameData.homeworld.buildings[b])
                    {
                        if('storage' in this.gameData.homeworld.buildings[b][res] && 'spice' in this.gameData.homeworld.buildings[b][res].storage)
                        {
                            max += this.gameData.homeworld.buildings[b][res].storage.spice.amount*this.gameData.homeworld.buildings[b][res].amount;
                        }
                    }
                }

                //Mult
                this.gameData.resources.luxury.spice.produce = gain;
                this.gameData.resources.luxury.spice.loss = loss;
                this.gameData.resources.luxury.spice.max = max;
            },
            tickPopulationStuff: function() {
                var max = 0;
                for(var b in this.gameData.homeworld.buildings)
                {
                    for(var res in this.gameData.homeworld.buildings[b])
                    {
                        if('storage' in this.gameData.homeworld.buildings[b][res] && 'pop' in this.gameData.homeworld.buildings[b][res].storage)
                        {
                            max += this.gameData.homeworld.buildings[b][res].storage.pop.amount*this.gameData.homeworld.buildings[b][res].amount;
                        }
                    }
                }
                this.gameData.resources.population.max = max;

                max = 0;
                for(var b in this.gameData.homeworld.buildings)
                {
                    for(var res in this.gameData.homeworld.buildings[b])
                    {
                        if('storage' in this.gameData.homeworld.buildings[b][res] && 'scholars' in this.gameData.homeworld.buildings[b][res].storage)
                        {
                            max += this.gameData.homeworld.buildings[b][res].storage.scholars.amount*this.gameData.homeworld.buildings[b][res].amount;
                        }
                    }
                }
                this.gameData.jobs.advanced.scholar.max = max;

                max = 0;
                for(var b in this.gameData.homeworld.buildings)
                {
                    for(var res in this.gameData.homeworld.buildings[b])
                    {
                        if('storage' in this.gameData.homeworld.buildings[b][res] && 'priests' in this.gameData.homeworld.buildings[b][res].storage)
                        {
                            max += this.gameData.homeworld.buildings[b][res].storage.priests.amount*this.gameData.homeworld.buildings[b][res].amount;
                        }
                    }
                }
                this.gameData.jobs.advanced.priest.max = max;

                max = 0;
                for(var b in this.gameData.homeworld.buildings)
                {
                    for(var res in this.gameData.homeworld.buildings[b])
                    {
                        if('storage' in this.gameData.homeworld.buildings[b][res] && 'artisan' in this.gameData.homeworld.buildings[b][res].storage)
                        {
                            max += this.gameData.homeworld.buildings[b][res].storage.artisan.amount*this.gameData.homeworld.buildings[b][res].amount;
                        }
                    }
                }
                this.gameData.jobs.advanced.artisan.max = max;

                max = 0;
                for(var b in this.gameData.homeworld.buildings)
                {
                    for(var res in this.gameData.homeworld.buildings[b])
                    {
                        if('storage' in this.gameData.homeworld.buildings[b][res] && 'operators' in this.gameData.homeworld.buildings[b][res].storage)
                        {
                            max += this.gameData.homeworld.buildings[b][res].storage.operators.amount*this.gameData.homeworld.buildings[b][res].amount;
                        }
                    }
                }
                if(max>0) this.gameData.tabs.civ.subtabs.operators.visable = true;
                this.gameData.jobs.advanced.operator.max = max;

                //Operator Contraption stuff
                this.gameData.jobs.advanced.operator.contraptions.concreteplant.max = this.gameData.homeworld.buildings.industrial.concreteplant.amount*this.gameData.homeworld.buildings.industrial.concreteplant.workers;
                this.gameData.jobs.advanced.operator.contraptions.smelter.max = this.gameData.homeworld.buildings.industrial.smelter.amount*this.gameData.homeworld.buildings.industrial.smelter.workers;

                if(this.gameData.resources.population.amount > 0)
                {
                    if(this.gameData.resources.basic.food.amount > 0)
                    {
                        this.gameData.resources.population.starve = Math.max(0, this.gameData.resources.population.starve-2.5*(this.gameData.tick/1000));
                    }
                    else
                    {
                        this.gameData.resources.population.starve += this.gameData.tick/1000;
                    }
                }
                else
                {
                    this.gameData.resources.population.starve = 0;
                }
            },
            operatorJob: function(id, amount) {
                if(amount>0)
                {
                    amount = Math.min(this.gameData.jobs.advanced.operator.amount-this.gameData.jobs.advanced.operator.active, Math.min(id.max-id.amount, amount));
                }
                else
                {
                    amount = -Math.min(id.amount, -amount);
                }
                this.gameData.jobs.advanced.operator.active +=amount;
                id.amount += amount;
            },
            killPop: function(id) {
                if(id == this.gameData.jobs.unemployed)
                {
                    this.increaseResource(this.gameData.resources.population, -1);
                }
                else
                {
                    this.changeJob(id, -1);
                    this.increaseResource(this.gameData.resources.population, -1);
                }
                this.gameData.runinfo.dead++;
                this.awardAchievement(this.gameData.achievements.dead);
            },
            killRandomPop: function() {
                let whomToKill = this.getRandomInt(this.gameData.resources.population.amount, 0);
                console.log("Whom to kill: " + whomToKill)
                let checked = 0;
                
                for(let t in this.gameData.jobs)
                {
                    if(t == "unemployed") 
                    {
                        if(this.gameData.jobs.unemployed.amount > whomToKill)
                        {
                            console.log("Killing Unemployed!")
                            this.killPop(this.gameData.jobs.unemployed)
                            return;
                        }
                        checked += this.gameData.jobs.unemployed.amount;
                        continue; 
                    }
                    for(let j in this.gameData.jobs[t])
                    {
                        if(this.gameData.jobs[t][j].amount + checked > whomToKill)
                        {
                            console.log("Killing " + this.gameData.jobs[t][j].name + "!")
                            this.killPop(this.gameData.jobs[t][j]);
                            return;
                        }
                        checked += this.gameData.jobs[t][j].amount;
                    }
                }
            },
            changeJob: function(id, amount) {
                if(amount>0)
                {
                    amount = Math.min(this.gameData.jobs.unemployed.amount, id.max>=0?Math.min(id.max-id.amount, amount):amount);
                }
                else
                {
                    amount = -Math.min(id.amount, -amount);
                    
                    if(id == this.gameData.jobs.advanced.operator && this.gameData.jobs.advanced.operator.amount + amount < this.gameData.jobs.advanced.operator.active)
                    {
                        let remove = -(this.gameData.jobs.advanced.operator.amount + amount + this.gameData.jobs.advanced.operator.active);
                        for (let index = 0; index < remove; index++) 
                        {
                            for(let c in this.gameData.jobs.advanced.operator.contraptions)
                            {
                                let whomToRemove = this.getRandomInt(this.gameData.jobs.advanced.operator.active, 0);
                                let checked = 0;
                                for(let c in this.gameData.jobs.advanced.operator.contraptions)
                                {
                                    if(this.gameData.jobs.advanced.operator.contraptions[c].amount + checked > whomToRemove)
                                    {
                                        this.gameData.jobs.advanced.operator.contraptions[c].amount--;
                                        this.gameData.jobs.advanced.operator.active--;
                                        break;
                                    }
                                    checked += this.gameData.jobs.advanced.operator.contraptions[c].amount;
                                }
                            }
                        }
                        
                    }
                }
                this.gameData.jobs.unemployed.amount -= amount;
                id.amount +=amount;
            },
            buyBuilding: function(id) {
                for(var t in id.cost)
                {
                    for(var r in id.cost[t])
                    {
                        if(this.gameData.resources[t][r].amount < id.cost[t][r].amount) return false;
                    }
                }
                for(var t in id.cost)
                {
                    for(var r in id.cost[t])
                    {
                        this.gameData.resources[t][r].amount -= id.cost[t][r].amount;
                    }
                }
                id.amount++;
                switch (id.id) {
                    case "lodge":
                        break;
                    case "farm":
                        this.gameData.jobs.basic.farmer.visable = true;
                        break;
                    case "library":
                        this.gameData.jobs.advanced.scholar.visable = true;
                        break;
                    case "shrine":
                        this.gameData.jobs.advanced.priest.visable = true;
                        break;
                    case "workshop":
                        this.gameData.jobs.advanced.artisan.visable = true;
                        break;
                    case "lumberyard":
                        this.gameData.jobs.basic.lumberjack.visable = true;
                        break;
                    case "quarry":
                        this.gameData.jobs.basic.quarry_worker.visable = true;
                        break;
                    case "concreteplant":
                        this.gameData.jobs.advanced.operator.visable = true;
                        break;
                    case "smelter":
                        this.gameData.jobs.advanced.operator.visable = true;
                        break;
                    case "barn":
                        break;
                    default:
                        break;
                }
            },
            completeResearch: function(id) {
                if(this.hasResourcesResearch(id))
                {
                    for(var t in id.cost)
                    {
                        for(var r in id.cost[t])
                        {
                            this.gameData.resources[t][r].amount -= id.cost[t][r].amount;
                        }
                    }
                    id.completed = true;
                    switch (id.id) {
                        case "knowledge":
                            this.gameData.research.knowledge2.visable=true;
                            this.gameData.research.roads.visable=true;
                            break;
                        case "knowledge2":
                            this.gameData.research.knowledge3.visable=true;
                            this.gameData.research.agriculture.visable=true;
                            this.gameData.research.faith.visable=true;
                            this.gameData.homeworld.buildings.cultural.library.storage.knowledge.amount += 15;
                            this.gameData.homeworld.buildings.cultural.library.storage.culture.amount += 5;
                            this.gameData.jobs.advanced.scholar.knowledgeGain += 0.03;
                            break;
                        case "knowledge3":
                            this.gameData.homeworld.buildings.cultural.library.storage.knowledge.amount += 25;
                            this.gameData.homeworld.buildings.cultural.library.storage.culture.amount += 10;
                            this.gameData.jobs.advanced.scholar.knowledgeGain += 0.05;
                            this.gameData.research.concrete.visable = true;
                            if(this.gameData.research.hunting2.completed) 
                            {
                                this.gameData.research.knowledge4.visable=true;
                            }
                            if(this.gameData.research.education2.completed) 
                            {
                                this.gameData.research.education3.visable = true;
                            }
                            break;
                        case "knowledge4":
                            this.gameData.homeworld.buildings.cultural.library.storage.knowledge.amount += 30;
                            this.gameData.homeworld.buildings.cultural.library.storage.culture.amount += 5;
                            this.gameData.jobs.advanced.scholar.knowledgeGain += 0.05;
                            this.gameData.jobs.advanced.scholar.toolMult += 0.05;
                            this.gameData.research.engineering.visable = true;
                            if(this.gameData.research.engineering.completed) 
                            {
                                this.gameData.research.knowledge5.visable = true;
                            }
                            break;
                        case "knowledge5":
                            this.gameData.homeworld.buildings.cultural.library.storage.knowledge.amount += 20;
                            this.gameData.homeworld.buildings.cultural.library.name = "Scholar's Abode";
                            this.gameData.homeworld.buildings.cultural.library.title = "Where Scholars Think About Stuff";
                            this.gameData.jobs.advanced.scholar.knowledgeGain += 0.05;
                            this.gameData.jobs.advanced.scholar.name = "Scholar";
                            this.gameData.research.engineering2.visable = true;
                            this.gameData.research.artistry.visable = true;
                            if(this.gameData.research.faith4.completed)
                            {
                                this.gameData.research.faith5.visable = true;
                            }
                            break;
                        case "hunting":
                            this.gameData.jobs.basic.hunter.toolMult += 0.3;
                            this.gameData.research.dogs.visable=true;
                            break;
                        case "hunting2":
                            this.gameData.jobs.basic.hunter.toolMult += 0.4;
                            this.awardAchievement(this.gameData.achievements.copper);
                            this.gameData.research.axe.visable=true;
                            this.gameData.research.pick.visable=true;
                            if(this.gameData.research.agriculture.completed) 
                            {
                                this.gameData.research.hoe.visable=true;
                            }
                            if(this.gameData.research.knowledge3.completed) 
                            {
                                this.gameData.research.knowledge4.visable=true;
                            }
                            break;
                        case "axe":
                            this.gameData.jobs.basic.lumberjack.toolMult += 0.4;
                            break;
                        case "pick":
                            this.gameData.jobs.basic.quarry_worker.toolMult += 0.6;
                            break;
                        case "hoe":
                            this.gameData.jobs.basic.farmer.toolMult += 0.5;
                            this.gameData.research.shovel.visable=true;
                            break;
                        case "shovel":
                            this.gameData.jobs.basic.farmer.toolMult += 0.2;
                            this.gameData.research.agriculture6.visable=true;
                            if(this.gameData.research.roads.completed)
                            {
                                this.gameData.research.roads2.visable=true;
                            }
                            break;
                        case "accessories":
                            this.awardAchievement(this.gameData.achievements.bling);
                            break;
                        case "faith":
                            this.gameData.research.faith2.visable=true;
                            this.gameData.research.education.visable=true;
                            break;
                        case "faith2":
                            this.gameData.jobs.advanced.priest.faithGain += 0.03;
                            this.gameData.jobs.advanced.priest.cultureGain += 0.01;
                            this.gameData.homeworld.buildings.cultural.shrine.storage.faith.amount += 15;
                            this.gameData.homeworld.buildings.cultural.shrine.storage.culture.amount += 5;
                            this.gameData.research.faith3.visable=true;
                            break;
                        case "faith3":
                            this.gameData.jobs.advanced.priest.faithGain += 0.05;
                            this.gameData.jobs.advanced.priest.cultureGain += 0.01;
                            this.gameData.homeworld.buildings.cultural.shrine.storage.faith.amount += 25;
                            this.gameData.homeworld.buildings.cultural.shrine.storage.culture.amount += 10;
                            if(this.gameData.research.artistry.completed)
                            {
                                this.gameData.research.faith4.visable = true;
                            }
                            break;
                        case "faith4":
                            this.gameData.jobs.advanced.priest.faithGain += 0.05;
                            this.gameData.jobs.advanced.priest.cultureGain += 0.01;
                            this.gameData.homeworld.buildings.cultural.shrine.storage.faith.amount += 30;
                            this.gameData.homeworld.buildings.cultural.shrine.storage.culture.amount += 10;
                            this.gameData.research.faith5.visable = true;
                            break;
                        case "faith5":
                            this.gameData.jobs.advanced.priest.faithGain += 0.05;
                            this.gameData.jobs.advanced.priest.cultureGain += 0.02;
                            this.gameData.homeworld.buildings.cultural.shrine.storage.faith.amount += 20;
                            this.gameData.homeworld.buildings.cultural.shrine.storage.culture.amount += 10;
                            this.gameData.jobs.advanced.priest.name = "Priest";
                            this.gameData.homeworld.buildings.cultural.shrine.name = "Shrine";
                            this.gameData.homeworld.buildings.cultural.shrine.title = "Where Priests Pray To The Spirits";
                            break;
                        case "artistry":
                            this.gameData.research.accessories.visable=true;
                            if(this.gameData.research.faith3.completed)
                            {
                                this.gameData.research.faith4.visable = true;
                            }
                            break;
                        case "education":
                            this.gameData.resources.population.education += 1;
                            this.gameData.research.education2.visable=true;
                            this.gameData.research.mining.visable=true;
                            this.gameData.research.commonsense.visable=true;
                            break;
                        case "education2":
                            this.gameData.resources.population.education += 1;
                            if(this.gameData.research.knowledge3.completed)
                            {
                                this.gameData.research.education3.visable = true;
                            }
                            break;
                        case "education3":
                            this.gameData.resources.population.education += 1;
                            this.gameData.research.mining.visable=true;
                            this.gameData.research.commonsense.visable=true;
                            break;
                        case "roads":
                            this.gameData.multipliers.workers.roads.amount += 0.16;
                            if(this.gameData.research.shovel.completed) 
                            {
                                this.gameData.research.roads2.visable=true;
                            }
                            break;
                        case "roads2":
                            this.gameData.multipliers.workers.roads.amount += 0.08;
                            this.gameData.research.roads3.visable=true;
                            break;
                        case "roads3":
                            this.gameData.multipliers.workers.roads.amount += 0.04;
                            break;
                        case "concrete":
                            if(this.gameData.research.mining.completed) 
                            {
                                this.gameData.research.smelting.visable=true;
                            }
                            break;
                        case "mining":
                            this.gameData.jobs.basic.quarry_worker.oreGain += 0.04;
                            this.gameData.jobs.basic.quarry_worker.oreGainEx += 0.01;
                            if(this.gameData.research.concrete.completed) 
                            {
                                this.gameData.research.smelting.visable=true;
                            }
                            break;
                        case "mining2":
                            this.gameData.jobs.basic.quarry_worker.oreGain += 0.01;
                            this.gameData.homeworld.buildings.industrial.quarry.storage.stone.amount += 25;
                            this.gameData.homeworld.buildings.industrial.quarry.workers += 3;
                            this.gameData.homeworld.buildings.industrial.quarry.maintenance.wood.amount += 0.01;
                            this.gameData.homeworld.buildings.industrial.quarry.cost.basic.wood.amount += 15;
                            this.awardAchievement(this.gameData.achievements.dig);
                            break;
                        case "smelting":
                            this.gameData.research.metalurgy.visable=true;
                            break;
                        case "metalurgy":
                            this.gameData.research.hunting2.visable=true;
                            break;
                        case "commonsense":
                            this.gameData.resources.population.education += 1;
                            this.gameData.resources.population.commonsense = true;
                            this.awardAchievement(this.achievements.sane);
                            break;
                        case "dogs":
                            this.gameData.jobs.basic.hunter.toolMult += 0.5;
                            this.gameData.research.dogs2.visable = true;
                            if(this.gameData.research.agriculture5.completed) 
                            {
                                this.gameData.research.dogs3.visable = true;
                            }
                            break;
                        case "dogs2":
                            this.gameData.resources.population.food += 0.05;
                            this.awardAchievement(this.gameData.achievements.doggo);
                            break;
                        case "dogs3":
                            this.gameData.jobs.basic.farmer.cattle += 0.1;
                            break;
                        case "lodge":
                            this.gameData.homeworld.buildings.residential.lodge.name = "Villa";
                            this.gameData.homeworld.buildings.residential.lodge.storage.pop.amount+=2;
                            this.gameData.homeworld.buildings.residential.lodge.storage.wood.amount+=5;
                            this.gameData.homeworld.buildings.residential.lodge.storage.fur.amount+=5;
                            this.gameData.homeworld.buildings.residential.lodge.storage.food.amount+=10;
                            this.gameData.homeworld.buildings.residential.lodge.storage.spice.amount+=10;
                            this.gameData.homeworld.buildings.residential.lodge.maintenance.wood.amount += 0.01;
                            this.gameData.homeworld.buildings.residential.lodge.maintenance['concrete'] = { name: "Concrete", amount: 0.01 };
                            this.gameData.homeworld.buildings.residential.lodge.maintenance['copper'] = { name: "Copper", amount: 0.01 };
                            this.gameData.homeworld.buildings.residential.lodge.cost.basic.wood.amount += 10;
                            this.gameData.homeworld.buildings.residential.lodge.cost.basic.stone.amount += 5;
                            this.gameData.homeworld.buildings.residential.lodge.cost.basic['concrete'] = { name: "Concrete", amount: 5 };
                            this.gameData.homeworld.buildings.residential.lodge.cost.basic['copper'] = { name: "Copper", amount: 5 };
                            break;
                        case "agriculture":
                            this.gameData.research.agriculture2.visable=true;
                            this.gameData.research.agriculture3.visable=true;
                            if(this.gameData.research.hunting2.completed) 
                            {
                                this.gameData.research.hoe.visable=true;
                            }
                            break;
                        case "agriculture2":
                            this.gameData.homeworld.buildings.residential.farm.storage.pop.amount+=1;
                            break;
                        case "agriculture3":
                            this.gameData.research.agriculture4.visable=true;
                            this.gameData.research.agriculture5.visable=true;
                            this.gameData.jobs.basic.farmer.spring += 0.05;
                            this.gameData.jobs.basic.farmer.summer += 0.05;
                            this.gameData.jobs.basic.farmer.autumn += 0.1;
                            break;
                        case "agriculture4":
                            this.gameData.jobs.basic.farmer.spice += 0.5;
                            this.gameData.homeworld.buildings.residential.farm.storage.spice.amount += 5;
                            if(this.gameData.research.agriculture6.completed) 
                            {
                                this.gameData.homeworld.buildings.residential.farm.storage.spice.amount += 10;
                            }
                            break;
                        case "agriculture5":
                            this.gameData.jobs.basic.farmer.cattle += 0.1;
                            if(this.gameData.research.dogs.completed) 
                            {
                                this.gameData.research.dogs3.visable = true;
                            }
                            break;
                        case "agriculture6":
                            this.gameData.homeworld.buildings.residential.farm.storage.food.amount += 30;
                            if(this.gameData.research.agriculture4.completed) 
                            {
                                this.gameData.homeworld.buildings.residential.farm.storage.spice.amount += 10;
                            }
                            break;
                        case "engineering":
                            this.gameData.research.mining2.visable = true;
                            this.gameData.research.barn.visable = true;
                            this.gameData.research.lodge.visable = true;
                            if(this.gameData.research.knowledge4.completed)
                            {
                                this.gameData.research.knowledge5.visable = true;
                            }
                            break;
                        case "engineering2":
                            this.gameData.multipliers.workers.roads.amount += 0.32;
                            this.awardAchievement(this.gameData.achievements.wheel);
                            break;
                        case "barn":
                            break;
                        default:
                            console.log("Unknown research " + id.id)
                            break;
                    }
                }
            },
            hasResourcesResearch: function(id) {
                for(var t in id.cost)
                {
                    for(var r in id.cost[t])
                    {
                        if(this.gameData.resources[t][r].amount < id.cost[t][r].amount) return false;
                    }
                }
                return true;
            },
            getRandomInt: function(max) {
                return Math.floor(Math.random() * max);
            },
            getRandomInt: function(max, min) {
                return Math.floor(min + Math.random() * (max-min));
            },
            logBase: function(n, base) {
                return Math.log(Math.abs(n))/Math.log(Math.abs(base));
            }
        },
        mounted: function() {
            console.log("Started mounting~!");
            if (localStorage.getItem("saveData") !== null)
            {
                console.log("Loading!")
                let data = localStorage.getItem("saveData");
                this.gameData = JSON.parse(data);
                console.log("Loading complete!")
            }

            setInterval(() => {
                this.tickTime();
                this.tickEvents();
                this.allChange();
                this.tickResources();
            }, this.gameData.tick)

            setInterval(() => {
                let saveData = JSON.stringify(this.gameData)
                localStorage.setItem("saveData", saveData);
                console.log("Saving Complete!")
            }, 30000)
        },
        data: {
            gameData: {
                tick: 50,
                resources: {
                    money: {
                        name: "Money",
                        amount: 0,
                        max: 0,
                        produce: 0,
                        gain: 0,
                        loss: 0,
                        visable: false,
                        type: "Money",
                        multipliers: {
                            morale: "morale"
                        }
                    },
                    population: {
                        name: "Human",
                        amount: 0,
                        max: 1,
                        visable: false,
                        commonsense: false,
                        type: "Population",
                        starve: 0,
                        food: 0,
                        luxury: 0.05,
                        taxes: 0.1,
                        education: 0,
                        cultured: 0
                    },
                    morale: {
                        name: "Morale",
                        amount: 100,
                        max: 150,
                        effective: 100,
                        gain: 0,
                        loss: 0,
                        type: "Morale"
                    },
                    research: {
                        faith: {
                            name: "Faith",
                            amount: 0,
                            max: 100,
                            produce: 0,
                            gain: 0,
                            loss: 0,
                            visable: false,
                            type: "Research",
                            multipliers: {
                                morale: "morale"
                            }
                        },
                        knowledge: {
                            name: "Knowledge",
                            amount: 0,
                            max: 100,
                            produce: 0,
                            gain: 0,
                            loss: 0,
                            visable: false,
                            type: "Research",
                            multipliers: {
                                morale: "morale"
                            }
                        },
                        culture: {
                            name: "Culture",
                            amount: 0,
                            max: 100,
                            produce: 0,
                            gain: 0,
                            loss: 0,
                            visable: false,
                            type: "Research",
                            multipliers: {
                                morale: "morale"
                            }
                        }
                    },
                    basic: {
                        food: {
                            name: "Food",
                            amount: 0,
                            max: 100,
                            produce: 0,
                            gain: 0,
                            loss: 0,
                            visable: true,
                            type: "Basic",
                            multipliers: {
                                morale: "morale",
                                roads: "roads"
                            }
                        },
                        wood: {
                            name: "Wood",
                            amount: 0,
                            max: 100,
                            produce: 0,
                            gain: 0,
                            loss: 0,
                            visable: true,
                            type: "Basic",
                            multipliers: {
                                morale: "morale",
                                roads: "roads"
                            }
                        },
                        stone: {
                            name: "Stone",
                            amount: 0,
                            max: 100,
                            produce: 0,
                            gain: 0,
                            loss: 0,
                            visable: true,
                            type: "Basic",
                            multipliers: {
                                morale: "morale",
                                roads: "roads"
                            }
                        },
                        concrete: {
                            name: "Concrete",
                            amount: 0,
                            max: 0,
                            produce: 0,
                            gain: 0,
                            loss: 0,
                            visable: false,
                            type: "Basic",
                            multipliers: {
                                morale: "morale",
                                roads: "roads"
                            }
                        },
                        ore: {
                            name: "Ore",
                            amount: 0,
                            max: 0,
                            produce: 0,
                            gain: 0,
                            loss: 0,
                            visable: false,
                            type: "Basic",
                            multipliers: {
                                morale: "morale",
                                roads: "roads"
                            }
                        },
                        coal: {
                            name: "Coal",
                            amount: 0,
                            max: 0,
                            produce: 0,
                            gain: 0,
                            loss: 0,
                            visable: false,
                            type: "Basic",
                            multipliers: {
                                morale: "morale",
                                roads: "roads"
                            }
                        },
                        copper: {
                            name: "Copper",
                            amount: 0,
                            max: 0,
                            produce: 0,
                            gain: 0,
                            loss: 0,
                            visable: false,
                            type: "Basic",
                            multipliers: {
                                morale: "morale",
                                roads: "roads"
                            }
                        },
                        gold: {
                            name: "Gold",
                            amount: 0,
                            max: 0,
                            produce: 0,
                            gain: 0,
                            loss: 0,
                            visable: false,
                            type: "Basic",
                            multipliers: {
                                morale: "morale",
                                roads: "roads"
                            }
                        },
                        iron: {
                            name: "Iron",
                            amount: 0,
                            max: 0,
                            produce: 0,
                            gain: 0,
                            loss: 0,
                            visable: false,
                            type: "Basic",
                            multipliers: {
                                morale: "morale",
                                roads: "roads"
                            }
                        }
                    },
                    luxury: {
                        fur: {
                            name: "Fur",
                            amount: 0,
                            max: 100,
                            produce: 0,
                            gain: 0,
                            loss: 0,
                            visable: false,
                            type: "Luxury",
                            multipliers: {
                                morale: "morale",
                                roads: "roads"
                            }
                        },
                        spice: {
                            name: "Spice",
                            amount: 0,
                            max: 0,
                            produce: 0,
                            gain: 0,
                            loss: 0,
                            visable: false,
                            type: "Luxury",
                            multipliers: {
                                morale: "morale",
                                roads: "roads"
                            }
                        }
                    }
                },
                jobs: {
                    unemployed: {
                        name: "Unemployed",
                        amount: 0,
                        max: -1,
                        visable: true,
                        food: 0.05
                    },
                    basic: {
                        hunter: {
                            name: "Hunter",
                            amount: 0,
                            max: -1,
                            visable: true,
                            food: 0.1,
                            foodGain: 0.35,
                            furGain: 0.15,
                            toolMult: 1
                        },
                        farmer: {
                            name: "Farmer",
                            amount: 0,
                            max: -1,
                            visable: false,
                            food: 0.05,
                            spice: 0,
                            cattle: 0,
                            spring: 0.25,
                            summer: 0.3,
                            autumn: 0.45,
                            winter: 0,
                            toolMult: 1
                        },
                        lumberjack: {
                            name: "Lumberjack",
                            amount: 0,
                            max: -1,
                            visable: false,
                            food: 0.15,
                            woodGain: 0.2,
                            woodGainEx: 0.05,
                            toolMult: 1
                        },
                        quarry_worker: {
                            name: "Quarry Worker",
                            amount: 0,
                            max: -1,
                            visable: false,
                            food: 0.2,
                            stoneGain: 0.1,
                            stoneGainEx: 0.02,
                            oreGain: 0,
                            oreGainEx: 0,
                            toolMult: 1
                        }
                    },
                    advanced: {
                        scholar: {
                            name: "Keeper",
                            amount: 0,
                            max: 0,
                            visable: false,
                            food: 0.15,
                            knowledgeGain: 0.07,
                            cultureGain: 0.05,
                            toolMult: 1
                        },
                        priest: {
                            name: "Shaman",
                            amount: 0,
                            max: 0,
                            visable: false,
                            food: 0.15,
                            faithGain: 0.07,
                            cultureGain: 0.05,
                            toolMult: 1
                        },
                        artisan: {
                            name: "Artisan",
                            amount: 0,
                            max: 0,
                            visable: false,
                            food: 0.1,
                            cultureGain: 0.07,
                            toolMult: 1
                        },
                        operator: {
                            name: "Operator",
                            amount: 0,
                            max: 0,
                            active: 0,
                            visable: false,
                            food: 0.05,
                            foodActive: 0.15,
                            toolMult: 1,
                            contraptions: {
                                concreteplant: {
                                    name: "Concrete Mixing",
                                    amount: 0,
                                    max: 0,
                                    produce: {
                                        basic: {
                                            concrete: {
                                                name: "Concrete",
                                                amount: 0.07
                                            }
                                        }
                                    },
                                    cost: {
                                        basic: {
                                            stone: {
                                                name: "Stone",
                                                amount: 0.15
                                            }
                                        }
                                    }
                                },
                                smelter: {
                                    name: "Smelting",
                                    amount: 0,
                                    max: 0,
                                    produce: {
                                        basic: {
                                            copper: {
                                                name: "Copper",
                                                amount: 0.1
                                            },
                                            iron: {
                                                name: "Iron",
                                                amount: 0
                                            }
                                        }
                                    },
                                    cost: {
                                        basic: {
                                            coal: {
                                                name: "Coal",
                                                amount: 0.05
                                            },
                                            ore: {
                                                name: "Ore",
                                                amount: 0.1
                                            }
                                        }
                                    }
                                },
                                sawmill: {
                                    name: "Sawing",
                                    amount: 0,
                                    max: 0,
                                    produce: {
                                        basic: {
                                            
                                        }
                                    },
                                    cost: {
                                        basic: {
                                            
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                tabs: {
                    world: {
                        name: "World",
                        visable: true,
                        selected: true,
                        subtabs: {
                            city: {
                                name: "Camp",
                                visable: true,
                                selected: true
                            }
                        }
                    },
                    civ: {
                        name: "Civ",
                        visable: false,
                        selected: false,
                        subtabs: {
                            jobs: {
                                name: "Jobs",
                                visable: false,
                                selected: true
                            },
                            operators: {
                                name: "Operators",
                                visable: false,
                                selected: false
                            }
                        }
                    },
                    research: {
                        name: "Research",
                        visable: false,
                        selected: false,
                        subtabs: {
                            new: {
                                name: "New",
                                visable: true,
                                selected: true
                            },
                            completed: {
                                name: "Completed",
                                visable: true,
                                selected: false
                            }
                        }
                    },
                    achievements: {
                        name: "Achievements",
                        visable: false,
                        selected: false,
                        subtabs: {

                        }
                    },
                    options: {
                        name: "Options",
                        visable: true,
                        selected: false,
                        subtabs: {

                        }
                    }
                },
                runinfo: {
                    time: 0,
                    ticks: 0,
                    dead: 0
                },
                research: {
                    knowledge: {
                        name: "Knowledge Keepers",
                        completed: false,
                        visable: true,
                        id: "knowledge",
                        desc: "Figure out how to ensure knowledge is shared among your people.",
                        cost: {
                            research: {
                                knowledge: {
                                    name: "Knowledge",
                                    amount: 10
                                }
                            }
                        }
                    },
                    knowledge2: {
                        name: "Basic Writing",
                        completed: false,
                        visable: false,
                        id: "knowledge2",
                        desc: "Make symbols on rocks that mean stuff, to help remember things better.",
                        cost: {
                            basic: {
                                stone: {
                                    name: "Stone",
                                    amount: 10
                                }
                            },
                            research: {
                                knowledge: {
                                    name: "Knowledge",
                                    amount: 20
                                },
                                culture: {
                                    name: "Culture",
                                    amount: 10
                                }
                            }
                        }
                    },
                    knowledge3: {
                        name: "Basic Mathematics",
                        completed: false,
                        visable: false,
                        id: "knowledge3",
                        desc: "New symbols for the newest greatest things in counting, 'addition' and 'subtraction'! Even a completely revolutionary thing called 'multiplication' where you add things many times!",
                        cost: {
                            research: {
                                knowledge: {
                                    name: "Knowledge",
                                    amount: 50
                                },
                                culture: {
                                    name: "Culture",
                                    amount: 15
                                }
                            }
                        }
                    },
                    knowledge4: {
                        name: "Basic Geometry",
                        completed: false,
                        visable: false,
                        id: "knowledge4",
                        desc: "Shapes have always been important, but with recent developments, you also came up with tools to better ways study them, in what you're starting to call geometry!",
                        cost: {
                            basic: {
                                wood: {
                                    name: "Wood",
                                    amount: 10
                                },
                                coal: {
                                    name: "Coal",
                                    amount: 10
                                },
                                copper: {
                                    name: "Copper",
                                    amount: 10
                                }
                            },
                            research: {
                                knowledge: {
                                    name: "Knowledge",
                                    amount: 70
                                },
                                culture: {
                                    name: "Culture",
                                    amount: 25
                                }
                            }
                        }
                    },
                    knowledge5: {
                        name: "Study Groups",
                        completed: false,
                        visable: false,
                        id: "knowledge5",
                        desc: "Instead of focusing primarily on merely on remembering things that have already been found out, your keepers now with to focus on expanding that knowledge, gathering together to discuss ideas. As such, they feel like they should have a new title, 'Scholars'. They seem mighty proud of that one, is that what they've been discussing?",
                        cost: {
                            research: {
                                knowledge: {
                                    name: "Knowledge",
                                    amount: 400
                                },
                                culture: {
                                    name: "Culture",
                                    amount: 50
                                }
                            }
                        }
                    },
                    hunting: {
                        name: "Better Spears",
                        completed: false,
                        visable: true,
                        id: "hunting",
                        desc: "Instead of using sharpened sticks, carve more straight ones, with sharp rocks at the end!",
                        cost: {
                            basic: {
                                wood: {
                                    name: "Wood",
                                    amount: 10
                                },
                                stone: {
                                    name: "Stone",
                                    amount: 10
                                }
                            },
                            research: {
                                knowledge: {
                                    name: "Knowledge",
                                    amount: 20
                                }
                            }
                        }
                    },
                    hunting2: {
                        name: "Copper Spear",
                        completed: false,
                        visable: false,
                        id: "hunting2",
                        desc: "First tool you thought to improve? The original, obviously! Not only can we straighten it out better now, but with an even heftier spear head, there'll be more oomph in each hit. And you can even hammer it back into shape when it dulls!",
                        cost: {
                            basic: {
                                stone: {
                                    name: "Stone",
                                    amount: 10
                                },
                                copper: {
                                    name: "Copper",
                                    amount: 10
                                }
                            },
                            research: {
                                knowledge: {
                                    name: "Knowledge",
                                    amount: 40
                                }
                            }
                        }
                    },
                    roads: {
                        name: "Gravel Roads",
                        completed: false,
                        visable: false,
                        id: "roads",
                        desc: "So, people don't like walking through dirt and mud, it's slow, and means they have to wash more often. A layer of gravel on the most commonly used areas could potentially solve some of the issues.",
                        cost: {
                            basic: {
                                stone: {
                                    name: "Stone",
                                    amount: 40
                                }
                            },
                            research: {
                                knowledge: {
                                    name: "Knowledge",
                                    amount: 10
                                },
                                culture: {
                                    name: "Culture",
                                    amount: 10
                                }
                            }
                        }
                    },
                    roads2: {
                        name: "Concrete Roads",
                        completed: false,
                        visable: false,
                        id: "roads2",
                        desc: "Gravel roads are fine, but the looseness can be a bit of a problem. And while Concrete could solve this, until now, there hasn't been any good way dig out enough ground fast enough to make it worthwhile. Mixing in some gravel reduces the overall need for concrete, thankfully.",
                        cost: {
                            basic: {
                                wood: {
                                    name: "Wood",
                                    amount: 40
                                },
                                stone: {
                                    name: "Stone",
                                    amount: 100
                                },
                                concrete: {
                                    name: "Concrete",
                                    amount: 150
                                }
                            },
                            research: {
                                knowledge: {
                                    name: "Knowledge",
                                    amount: 100
                                },
                                culture: {
                                    name: "Culture",
                                    amount: 50
                                }
                            }
                        }
                    },
                    roads3: {
                        name: "Road Drains",
                        completed: false,
                        visable: false,
                        id: "roads3",
                        desc: "Add channels on the side of the road where water can run, instead of it gathering on the roads itself. Also means less mud on them, which makes people happy.",
                        cost: {
                            basic: {
                                concrete: {
                                    name: "Concrete",
                                    amount: 50
                                }
                            },
                            research: {
                                knowledge: {
                                    name: "Knowledge",
                                    amount: 200
                                }
                            }
                        }
                    },
                    concrete: {
                        name: "Concrete Mixing",
                        completed: false,
                        visable: false,
                        id: "concrete",
                        desc: "Turns out mixing a certain type of rock, grounded down, with sand and water, we can make a kind of liquid that then turns back into rock! Too brittle to make any new tools out of, though.",
                        cost: {
                            basic: {
                                stone: {
                                    name: "Stone",
                                    amount: 25
                                }
                            },
                            research: {
                                knowledge: {
                                    name: "Knowledge",
                                    amount: 20
                                }
                            }
                        }
                    },
                    mining: {
                        name: "Ore Mining",
                        completed: false,
                        visable: false,
                        id: "mining",
                        desc: "Sometimes the rocks contain other rocks. Maybe we should stop avoiding them?",
                        cost: {
                            basic: {
                                wood: {
                                    name: "Wood",
                                    amount: 10
                                },
                                stone: {
                                    name: "Stone",
                                    amount: 10
                                }
                            },
                            research: {
                                knowledge: {
                                    name: "Knowledge",
                                    amount: 20
                                }
                            }
                        }
                    },
                    mining2: {
                        name: "Deeper Mining",
                        completed: false,
                        visable: false,
                        id: "mining2",
                        desc: "With new building techniques, you can make sure your workers can get out of deeper holes safely, letting more people work each quarry. Oh, and store more loose rock, too. Maybe you'll find something new in the deeper parts?",
                        cost: {
                            basic: {
                                wood: {
                                    name: "Wood",
                                    amount: 100
                                },
                                stone: {
                                    name: "Stone",
                                    amount: 20
                                }
                            },
                            research: {
                                knowledge: {
                                    name: "Knowledge",
                                    amount: 200
                                }
                            }
                        }
                    },
                    smelting: {
                        name: "Basic Smelting",
                        completed: false,
                        visable: false,
                        id: "smelting",
                        desc: "Those new rocks? People have been starting calling them 'ores'. For now, most of them are useless, but maybe we can come up with a way to change that?",
                        cost: {
                            basic: {
                                concrete: {
                                    name: "Concrete",
                                    amount: 10
                                },
                                ore: {
                                    name: "Ore",
                                    amount: 10
                                },
                                coal: {
                                    name: "Coal",
                                    amount: 10
                                }
                            },
                            research: {
                                knowledge: {
                                    name: "Knowledge",
                                    amount: 30
                                }
                            }
                        }
                    },
                    metalurgy: {
                        name: "Copper Analysis",
                        completed: false,
                        visable: false,
                        id: "metalurgy",
                        desc: "Well, heating up some of those rocks worked! It produced this new thing people are starting to call copper, and, it appears we can shape it much better than regular rocks. Perhaps it will be useful in making tools?",
                        cost: {
                            basic: {
                                stone: {
                                    name: "Stone",
                                    amount: 10
                                },
                                copper: {
                                    name: "Copper",
                                    amount: 10
                                }
                            },
                            research: {
                                knowledge: {
                                    name: "Knowledge",
                                    amount: 40
                                }
                            }
                        }
                    },
                    axe: {
                        name: "Copper Axe",
                        completed: false,
                        visable: false,
                        id: "axe",
                        desc: "Again, the extra heft means less swicngs to cut down trees, though all the dulling means that the effect isn't as noticable.",
                        cost: {
                            basic: {
                                stone: {
                                    name: "Stone",
                                    amount: 10
                                },
                                copper: {
                                    name: "Copper",
                                    amount: 15
                                }
                            },
                            research: {
                                knowledge: {
                                    name: "Knowledge",
                                    amount: 40
                                }
                            }
                        }
                    },
                    pick: {
                        name: "Copper Pick",
                        completed: false,
                        visable: false,
                        id: "pick",
                        desc: "A lot more rock seems to break loose when using these! And a novel new shape makes the dulling much less of a problem than some of the other tools!",
                        cost: {
                            basic: {
                                stone: {
                                    name: "Stone",
                                    amount: 10
                                },
                                copper: {
                                    name: "Copper",
                                    amount: 15
                                }
                            },
                            research: {
                                knowledge: {
                                    name: "Knowledge",
                                    amount: 50
                                }
                            }
                        }
                    },
                    hoe: {
                        name: "Copper Hoe",
                        completed: false,
                        visable: false,
                        id: "hoe",
                        desc: "Your farmers are getting into the copper craze! With these there's less need for replacing tools, since they're soft enough to not shatter if they hit a rock.",
                        cost: {
                            basic: {
                                stone: {
                                    name: "Stone",
                                    amount: 10
                                },
                                copper: {
                                    name: "Copper",
                                    amount: 10
                                }
                            },
                            research: {
                                knowledge: {
                                    name: "Knowledge",
                                    amount: 40
                                }
                            }
                        }
                    },
                    shovel: {
                        name: "Copper Shovel",
                        completed: false,
                        visable: false,
                        id: "shovel",
                        desc: "After making the hoe, one of your farmers thought up a briliant idea! A tool to efectively dig up dirt! With copper, you should be able to make a shape that's way more efficient than what you could do with flint.",
                        cost: {
                            basic: {
                                stone: {
                                    name: "Stone",
                                    amount: 10
                                },
                                copper: {
                                    name: "Copper",
                                    amount: 30
                                }
                            },
                            research: {
                                knowledge: {
                                    name: "Knowledge",
                                    amount: 70
                                }
                            }
                        }
                    },
                    accessories: {
                        name: "Copper Accessories",
                        completed: false,
                        visable: false,
                        id: "accessories",
                        desc: "People aren't content with only wearing clothes anymore. They want to wear 'accessories', and what better than using the new and amazing copper?",
                        cost: {
                            basic: {
                                copper: {
                                    name: "Copper",
                                    amount: 30
                                }
                            },
                            luxury: {
                                fur: {
                                    name: "Fur",
                                    amount: 30
                                }
                            },
                            research: {
                                culture: {
                                    name: "Culture",
                                    amount: 50
                                }
                            }
                        }
                    },
                    education: {
                        name: "Basic Universal Education",
                        completed: false,
                        visable: false,
                        id: "education",
                        desc: "Instead of just telling people the absolute minimum needed to do things, you now ensure that everyone knows at least a little bit.",
                        cost: {
                            basic: {
                                stone: {
                                    name: "Stone",
                                    amount: 10
                                }
                            },
                            research: {
                                knowledge: {
                                    name: "Knowledge",
                                    amount: 20
                                },
                                culture: {
                                    name: "Culture",
                                    amount: 10
                                }
                            }
                        }
                    },
                    education2: {
                        name: "Basic Universal Reading",
                        completed: false,
                        visable: false,
                        id: "education2",
                        desc: "Well, some of the schmucks were wondering what kind of strange symbols the Keepers were using, and they're annoying them now. Maybe, just maybe, we should teach the average dude them.",
                        cost: {
                            basic: {
                                stone: {
                                    name: "Stone",
                                    amount: 20
                                }
                            },
                            research: {
                                knowledge: {
                                    name: "Knowledge",
                                    amount: 30
                                },
                                culture: {
                                    name: "Culture",
                                    amount: 20
                                }
                            }
                        }
                    },
                    education3: {
                        name: "Basic Universal Mathematics",
                        completed: false,
                        visable: false,
                        id: "education3",
                        desc: "So, the new mathematics are great! In fact, so great we should teach the average schmuck about it!",
                        cost: {
                            research: {
                                knowledge: {
                                    name: "Knowledge",
                                    amount: 20
                                },
                                culture: {
                                    name: "Culture",
                                    amount: 40
                                }
                            }
                        }
                    },
                    faith: {
                        name: "Basic Theology",
                        completed: false,
                        visable: false,
                        id: "faith",
                        desc: "These people tell you how the world works! Or, well, how they think it does.",
                        cost: {
                            research: {
                                culture: {
                                    name: "Culture",
                                    amount: 10
                                }
                            }
                        }
                    },
                    faith2: {
                        name: "Weekly Sermons",
                        completed: false,
                        visable: false,
                        id: "faith2",
                        desc: "Drag people into listening to your religious people once a week. Some might need some convincing. Perhaps come up with a totally not made up reason why?",
                        cost: {
                            research: {
                                faith: {
                                    name: "Faith",
                                    amount: 10
                                },
                                culture: {
                                    name: "Culture",
                                    amount: 30
                                }
                            }
                        }
                    },
                    faith3: {
                        name: "Basic Numerology",
                        completed: false,
                        visable: false,
                        id: "faith3",
                        desc: "Well, it seems like your religious people are getting into the math hype. Maybe this will make them focus on less made up stuff?",
                        cost: {
                            research: {
                                faith: {
                                    name: "Faith",
                                    amount: 30
                                },
                                knowledge: {
                                    name: "Knowledge",
                                    amount: 30
                                }
                            }
                        }
                    },
                    faith4: {
                        name: "Religious Symbols",
                        completed: false,
                        visable: false,
                        id: "faith4",
                        desc: "With more understanding of symbols, your religious folk have started to assign meaning to them.",
                        cost: {
                            research: {
                                faith: {
                                    name: "Faith",
                                    amount: 70
                                },
                                culture: {
                                    name: "Culture",
                                    amount: 30
                                }
                            }
                        }
                    },
                    faith5: {
                        name: "Spirits and Shrines",
                        completed: false,
                        visable: false,
                        id: "faith5",
                        desc: "It seems like they are more and more starting to believe their own words, and have decided to folow the scholars' footsteps by revamping their huts into 'proper shrines, worthy of the spirits'. People actually seem to like the new designs?",
                        cost: {
                            research: {
                                faith: {
                                    name: "Faith",
                                    amount: 70
                                },
                                culture: {
                                    name: "Culture",
                                    amount: 30
                                }
                            }
                        }
                    },
                    artistry: {
                        name: "Artists",
                        completed: false,
                        visable: false,
                        id: "artistry",
                        desc: "People are starting to more and more want to do things beyond simple work. These guys, while still making useful things like pots and the like, seem to focus more on the things looking good. And honestly, people seem to appreciate it.",
                        cost: {
                            research: {
                                knowledge: {
                                    name: "Knowledge",
                                    amount: 50
                                },
                                faith: {
                                    name: "Faith",
                                    amount: 10
                                },
                                culture: {
                                    name: "Culture",
                                    amount: 100
                                }
                            }
                        }
                    },
                    commonsense: {
                        name: "Common Sense",
                        completed: false,
                        visable: false,
                        id: "commonsense",
                        desc: "Make 'common sense' actually common. Like, people, it's not that hard! No! Don't do that!",
                        cost: {
                            research: {
                                knowledge: {
                                    name: "Knowledge",
                                    amount: 2500
                                },
                                culture: {
                                    name: "Culture",
                                    amount: 1000
                                }
                            }
                        }
                    },
                    dogs: {
                        name: "Domesticate Wolves",
                        completed: false,
                        visable: false,
                        id: "dogs",
                        desc: "So, there's these creatures, wolves. They seem like good hunters, perhaps you can convince them to help your own?",
                        cost: {
                            basic: {
                                food: {
                                    name: "Food",
                                    amount: 100
                                }
                            },
                            research: {
                                knowledge: {
                                    name: "Knowledge",
                                    amount: 50
                                },
                                culture: {
                                    name: "Culture",
                                    amount: 30
                                }
                            }
                        }
                    },
                    dogs2: {
                        name: "Pet Dogs",
                        completed: false,
                        visable: false,
                        id: "dogs2",
                        desc: "So, those wolves we started feeding really helped our hunters! And they're really cute. Now everyone wants one! Of course, they're going to have to feed them.",
                        cost: {
                            basic: {
                                food: {
                                    name: "Food",
                                    amount: 200
                                }
                            },
                            research: {
                                knowledge: {
                                    name: "Knowledge",
                                    amount: 50
                                },
                                culture: {
                                    name: "Culture",
                                    amount: 70
                                }
                            }
                        }
                    },
                    dogs3: {
                        name: "Farm Dogs",
                        completed: false,
                        visable: false,
                        id: "dogs3",
                        desc: "So, those animals the farmers keep can be quite unruly. But maybe we can train some of our dogs to keep them in check?",
                        cost: {
                            basic: {
                                food: {
                                    name: "Food",
                                    amount: 200
                                }
                            },
                            research: {
                                knowledge: {
                                    name: "Knowledge",
                                    amount: 150
                                },
                                culture: {
                                    name: "Culture",
                                    amount: 100
                                }
                            }
                        }
                    },
                    lodge: {
                        name: "Redesigned Lodges",
                        completed: false,
                        visable: false,
                        id: "lodge",
                        desc: "With your new designing skills, you can come up with a much better house design. Not only with a second story, but a basement, too.",
                        cost: {
                            basic: {
                                wood: {
                                    name: "Wood",
                                    amount: 100
                                },
                                concrete: {
                                    name: "Concrete",
                                    amount: 30
                                },
                                copper: {
                                    name: "Copper",
                                    amount: 20
                                }
                            },
                            luxury: {
                                fur: {
                                    name: "Fur",
                                    amount: 25
                                }
                            },
                            research: {
                                knowledge: {
                                    name: "Knowledge",
                                    amount: 200
                                },
                                culture: {
                                    name: "Culture",
                                    amount: 50
                                }
                            }
                        }
                    },
                    agriculture: {
                        name: "Agriculture",
                        completed: false,
                        visable: false,
                        id: "agriculture",
                        desc: "Figure out how to grow things locally.",
                        cost: {
                            basic: {
                                food: {
                                    name: "Food",
                                    amount: 25
                                }
                            },
                            research: {
                                knowledge: {
                                    name: "Knowledge",
                                    amount: 25
                                },
                                culture: {
                                    name: "Culture",
                                    amount: 40
                                }
                            }
                        }
                    },
                    agriculture2: {
                        name: "Improved Farm House",
                        completed: false,
                        visable: false,
                        id: "agriculture2",
                        desc: "Figure out how to add an extra bed to your farm houses.",
                        cost: {
                            basic: {
                                wood: {
                                    name: "Wood",
                                    amount: 40
                                }
                            },
                            luxury: {
                                fur: {
                                    name: "Fur",
                                    amount: 25
                                }
                            },
                            research: {
                                knowledge: {
                                    name: "Knowledge",
                                    amount: 40
                                }
                            }
                        }
                    },
                    agriculture3: {
                        name: "Expand Crop Selection",
                        completed: false,
                        visable: false,
                        id: "agriculture3",
                        desc: "Figure out how to grow things besides bushes.",
                        cost: {
                            research: {
                                knowledge: {
                                    name: "Knowledge",
                                    amount: 100
                                }
                            }
                        }
                    },
                    agriculture4: {
                        name: "Growing Spices",
                        completed: false,
                        visable: false,
                        id: "agriculture4",
                        desc: "Start growing taste enhancers, called 'spices'. Having less bland food seems to make people more happy.",
                        cost: {
                            research: {
                                knowledge: {
                                    name: "Knowledge",
                                    amount: 100
                                },
                                culture: {
                                    name: "Culture",
                                    amount: 20
                                }
                            }
                        }
                    },
                    agriculture5: {
                        name: "Cattle",
                        completed: false,
                        visable: false,
                        id: "agriculture5",
                        desc: "Instead of having to have your hunters catch animals, you could keep them in pens. Make your farmers a bit less dependent on the seasons!",
                        cost: {
                            basic: {
                                wood: {
                                    name: "Wood",
                                    amount: 40
                                }
                            },
                            research: {
                                knowledge: {
                                    name: "Knowledge",
                                    amount: 100
                                },
                                culture: {
                                    name: "Culture",
                                    amount: 20
                                }
                            }
                        }
                    },
                    agriculture6: {
                        name: "Root Cellars",
                        completed: false,
                        visable: false,
                        id: "agriculture6",
                        desc: "With your new shovels, you could dig out rooms under the house. It seems to always be pretty cold in there, but it doesn't seem to be effected by the seasons much, which would make it great for storing more food!",
                        cost: {
                            basic: {
                                wood: {
                                    name: "Wood",
                                    amount: 40
                                },
                                copper: {
                                    name: "Copper",
                                    amount: 10
                                }
                            },
                            research: {
                                knowledge: {
                                    name: "Knowledge",
                                    amount: 100
                                }
                            }
                        }
                    },
                    engineering: {
                        name: "Basic Engineering",
                        completed: false,
                        visable: false,
                        id: "engineering",
                        desc: "Studying shapes have lead you to come up with practical uses for certain shapes when building.",
                        cost: {
                            basic: {
                                wood: {
                                    name: "Wood",
                                    amount: 10
                                },
                                coal: {
                                    name: "Coal",
                                    amount: 10
                                },
                                copper: {
                                    name: "Copper",
                                    amount: 10
                                }
                            },
                            research: {
                                knowledge: {
                                    name: "Knowledge",
                                    amount: 150
                                }
                            }
                        }
                    },
                    engineering2: {
                        name: "The Wheel And Axis",
                        completed: false,
                        visable: false,
                        id: "engineering2",
                        desc: "Further studying of the basic shapes have lead to a startling relization, rotating circles are way less enery consuming than anything else. Your scholars are calling this new invension 'The Wheel'.",
                        cost: {
                            basic: {
                                wood: {
                                    name: "Wood",
                                    amount: 50
                                },
                                copper: {
                                    name: "Copper",
                                    amount: 10
                                }
                            },
                            research: {
                                knowledge: {
                                    name: "Knowledge",
                                    amount: 350
                                }
                            }
                        }
                    },
                    barn: {
                        name: "Basic Central Storage",
                        completed: false,
                        visable: false,
                        id: "barn",
                        desc: "So, you're realizing that you might need to build a place dedicated to storing resources. And with your new knowledge of shapes, you have an idea for just how to do so.",
                        cost: {
                            basic: {
                                wood: {
                                    name: "Wood",
                                    amount: 100
                                },
                                stone: {
                                    name: "Stone",
                                    amount: 20
                                },
                                copper: {
                                    name: "Copper",
                                    amount: 30
                                }
                            },
                            research: {
                                knowledge: {
                                    name: "Knowledge",
                                    amount: 250
                                }
                            }
                        }
                    },
                },
                homeworld: {
                    name: "Earth",
                    area: {
                        total: 0,
                        available: 0,
                        used: 0
                    },
                    buildings: {
                        residential: {
                            lodge: {
                                name: "Lodge",
                                title: "Basic Housing",
                                id: "lodge",
                                amount: 0,
                                storage: {
                                    pop: {
                                        name: "Population",
                                        amount: 2
                                    },
                                    food: {
                                        name: "Food",
                                        amount: 10
                                    },
                                    wood: {
                                        name: "Wood",
                                        amount: 0,
                                    },
                                    fur: {
                                        name: "Fur",
                                        amount: 10
                                    },
                                    spice: {
                                        name: "Spice",
                                        amount: 0
                                    }
                                },
                                cost: {
                                    basic: {
                                        wood: {
                                            name: "Wood",
                                            amount: 10
                                        },
                                        stone: {
                                            name: "Stone",
                                            amount: 5
                                        }
                                    }
                                },
                                maintenance: {
                                    wood: {
                                        name: "Wood",
                                        amount: 0.03
                                    },
                                    stone: {
                                        name: "Stone",
                                        amount: 0.01
                                    }
                                }
                            },
                            farm: {
                                name: "Farm",
                                title: "For Growing Food, Locally",
                                id: "farm",
                                amount: 0,
                                storage: {
                                    pop: {
                                        name: "Population",
                                        amount: 2
                                    },
                                    food: {
                                        name: "Food",
                                        amount: 20
                                    },
                                    fur: {
                                        name: "Fur",
                                        amount: 10
                                    },
                                    spice: {
                                        name: "Spice",
                                        amount: 0
                                    }
                                },
                                cost: {
                                    basic: {
                                        wood: {
                                            name: "Wood",
                                            amount: 25
                                        },
                                        stone: {
                                            name: "Stone",
                                            amount: 15
                                        }
                                    }
                                },
                                maintenance: {
                                    wood: {
                                        name: "Wood",
                                        amount: 0.03
                                    },
                                    stone: {
                                        name: "Stone",
                                        amount: 0.01
                                    }
                                }
                            }
                        },
                        cultural: {
                            library: {
                                name: "Keeper's Hut",
                                title: "Where Keepers Work To Remember",
                                id: "library",
                                amount: 0,
                                storage: {
                                    scholars: {
                                        name: "Keepers",
                                        amount: 1
                                    },
                                    knowledge: {
                                        name: "Knowledge",
                                        amount: 10
                                    },
                                    culture: {
                                        name: "Culture",
                                        amount: 5
                                    }
                                },
                                cost: {
                                    basic: {
                                        wood: {
                                            name: "Wood",
                                            amount: 25
                                        },
                                        stone: {
                                            name: "Stone",
                                            amount: 20
                                        }
                                    }
                                },
                                maintenance: {
                                    wood: {
                                        name: "Wood",
                                        amount: 0.02
                                    }
                                }
                            },
                            shrine: {
                                name: "Shaman's Hut",
                                title: "Where Religious Folk Preach To Anyone Who Get Too Close",
                                id: "shrine",
                                amount: 0,
                                storage: {
                                    priests: {
                                        name: "Shamans",
                                        amount: 1
                                    },
                                    faith: {
                                        name: "Faith",
                                        amount: 10
                                    },
                                    culture: {
                                        name: "Culture",
                                        amount: 5
                                    }
                                },
                                cost: {
                                    basic: {
                                        wood: {
                                            name: "Wood",
                                            amount: 35
                                        },
                                        stone: {
                                            name: "Stone",
                                            amount: 20
                                        }
                                    },
                                    luxury: {
                                        fur: {
                                            name: "Fur",
                                            amount: 20
                                        }
                                    }
                                },
                                maintenance: {
                                    wood: {
                                        name: "Wood",
                                        amount: 0.02
                                    }
                                }
                            },
                            workshop: {
                                name: "Artist's Hut",
                                title: "Where Artisans Make Fancy Things",
                                id: "workshop",
                                amount: 0,
                                storage: {
                                    artisan: {
                                        name: "Artisan",
                                        amount: 1
                                    },
                                    culture: {
                                        name: "Culture",
                                        amount: 20
                                    }
                                },
                                cost: {
                                    basic: {
                                        wood: {
                                            name: "Wood",
                                            amount: 35
                                        },
                                        concrete: {
                                            name: "Concrete",
                                            amount: 20
                                        },
                                        copper: {
                                            name: "Copper",
                                            amount: 10
                                        }
                                    },
                                    luxury: {
                                        fur: {
                                            name: "Fur",
                                            amount: 20
                                        }
                                    }
                                },
                                maintenance: {
                                    wood: {
                                        name: "Wood",
                                        amount: 0.03
                                    },
                                    concrete: {
                                        name: "Concrete",
                                        amount: 0.02
                                    },
                                    coal: {
                                        name: "Coal",
                                        amount: 0.01
                                    },
                                    copper: {
                                        name: "Copper",
                                        amount: 0.01
                                    }
                                }
                            }
                        },
                        industrial: {
                            lumberyard: {
                                name: "Lumber Yard",
                                title: "For Storing Wood",
                                id: "lumberyard",
                                amount: 0,
                                workers: 2,
                                storage: {
                                    wood: {
                                        name: "Wood",
                                        amount: 10
                                    }
                                },
                                cost: {
                                    basic: {
                                        wood: {
                                            name: "Wood",
                                            amount: 15
                                        },
                                        stone: {
                                            name: "Stone",
                                            amount: 10
                                        }
                                    }
                                },
                                maintenance: {
                                    wood: {
                                        name: "Wood",
                                        amount: 0.02
                                    },
                                    stone: {
                                        name: "Stone",
                                        amount: 0.01
                                    }
                                }
                            },
                            quarry: {
                                name: "Quarry",
                                title: "For Mining Rock",
                                id: "quarry",
                                amount: 0,
                                workers: 5,
                                storage: {
                                    stone: {
                                        name: "Stone",
                                        amount: 25
                                    }
                                },
                                cost: {
                                    basic: {
                                        wood: {
                                            name: "Wood",
                                            amount: 40
                                        },
                                        stone: {
                                            name: "Stone",
                                            amount: 10
                                        }
                                    }
                                },
                                maintenance: {
                                    wood: {
                                        name: "Wood",
                                        amount: 0.02
                                    }
                                }
                            },
                            concreteplant: {
                                name: "Concrete Plant",
                                title: "For Mixing Liquid Stone",
                                id: "concreteplant",
                                amount: 0,
                                workers: 2,
                                storage: {
                                    operators: {
                                        name: "Operators",
                                        amount: 2
                                    }
                                },
                                cost: {
                                    basic: {
                                        wood: {
                                            name: "Wood",
                                            amount: 10
                                        },
                                        stone: {
                                            name: "Stone",
                                            amount: 50
                                        }
                                    }
                                },
                                maintenance: {
                                    stone: {
                                        name: "Stone",
                                        amount: 0.02
                                    }
                                }
                            },
                            smelter: {
                                name: "Smelter",
                                title: "For Smelting Ores",
                                id: "smelter",
                                amount: 0,
                                workers: 2,
                                storage: {
                                    operators: {
                                        name: "Operators",
                                        amount: 2
                                    }
                                },
                                cost: {
                                    basic: {
                                        stone: {
                                            name: "Stone",
                                            amount: 50
                                        },
                                        concrete: {
                                            name: "Concrete",
                                            amount: 15
                                        }
                                    }
                                },
                                maintenance: {
                                    stone: {
                                        name: "Stone",
                                        amount: 0.02
                                    },
                                    concrete: {
                                        name: "Concrete",
                                        amount: 0.01
                                    }
                                }
                            },
                            barn: {
                                name: "Barn",
                                title: "For Storing A Bunch Of Non-Perishables",
                                id: "barn",
                                amount: 0,
                                storage: {
                                    wood: {
                                        name: "Wood",
                                        amount: 50
                                    },
                                    stone: {
                                        name: "Stone",
                                        amount: 50
                                    },
                                    concrete: {
                                        name: "Concrete",
                                        amount: 50
                                    },
                                    ore: {
                                        name: "Ore",
                                        amount: 50
                                    },
                                    coal: {
                                        name: "Coal",
                                        amount: 50
                                    },
                                    copper: {
                                        name: "Copper",
                                        amount: 50
                                    },
                                    iron: {
                                        name: "Iron",
                                        amount: 0
                                    },
                                    fur: {
                                        name: "Fur",
                                        amount: 50
                                    }
                                },
                                cost: {
                                    basic: {
                                        wood: {
                                            name: "Wood",
                                            amount: 100
                                        },
                                        concrete: {
                                            name: "Concrete",
                                            amount: 50
                                        },
                                        copper: {
                                            name: "Copper",
                                            amount: 25
                                        }
                                    }
                                },
                                maintenance: {
                                    wood: {
                                        name: "Wood",
                                        amount: 0.05
                                    },
                                    concrete: {
                                        name: "Concrete",
                                        amount: 0.02
                                    },
                                    copper: {
                                        name: "Copper",
                                        amount: 0.01
                                    }
                                }
                            }
                        }
                    }
                },
                homesystem: {
                    star: {
                        name: "Sun",
                        area: {
                            total: 0,
                            available: 0,
                            used: 0
                        },
                        buildings: {
                        }
                    }
                    
                },
                universe: {
                    type: "standard",
                    time: 0,
                    galaxies: {
                        milkyway: {
                            
                        },
                        andromeda: {

                        }
                    }
                },
                multipliers: {
                    workers: {
                        roads: {
                            name: "Roads",
                            amount: 1
                        }
                    },
                    contraptions: {
                        morale: {
                            name: "Morale",
                            amount: 1
                        }
                    },
                    everything: {
                        
                    }
                    
                },
                events: {
                    custom: {
                        increasePop: {
                            min: 0,
                            increase: 0.05,
                            max: 1,
                            current: 1
                        }
                    },
                    daily: {
                        hunterFindStuff: {
                            msg: "Your hunters found some interesting stuff!",
                            min: 0,
                            increase: 0.005,
                            max: 1,
                            current: 0,
                            stuff: {
                                research: {
                                    knowledge: {
                                        name: "Knowledge",
                                        chance: 1,
                                        min: 1,
                                        max: 5
                                    }
                                }
                            }
                        },
                        starve: {
                            msg: "One of your people starved to death!",
                            min: 0,
                            increase: 0.05,
                            max: 1,
                            current: 0
                        }
                    },
                    seasonal: {

                    },
                    yearly: {

                    }
                },
                achievements: {
                    shinyrock: {
                        name: "What's that?",
                        desc: "Ohh! A shiny Rock",
                        achieved: false
                    },
                    dead: {
                        name: "Tragic End",
                        desc: "Mommy, why is he just laying there?",
                        achieved: false
                    },
                    doggo: {
                        name: "Man's Best Friend",
                        desc: "Can humans even live without these guys?",
                        achieved: false
                    },
                    copper: {
                        name: "Chalcolithic Age",
                        desc: "You have discovered the wonders of copper!",
                        achieved: false
                    },
                    bling: {
                        name: "Blinged Out",
                        desc: "Who has the fanciest bling?",
                        achieved: false
                    },
                    dig: {
                        name: "Diggy, Diggy Hole!",
                        desc: "Digging deep underground, the short man is.",
                        achieved: false
                    },
                    wheel: {
                        name: "The Wheel",
                        desc: "What do you mean, you've seen this before? It's completely new!",
                        achieved: false
                    },
                    sane: {
                        name: "The Sane Ones",
                        desc: "Wait. That's illegal!",
                        achieved: false
                    }
                }
            }
        },
        computed: {
        }
    })
})