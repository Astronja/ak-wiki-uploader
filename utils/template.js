import source from '../source.js';

export default class template {
    /**
     * Initialization of ~/OPERATOR page.
     * @param {object} data The data regarding the operator
     * @param {string} enname The page name of the operator (usually English).
     * @returns {string} The final wikitext
     */
    static op_main (data, enname) {
        let wikitextList = [];
        

        //Header and basic information
        const header = "{{Spoiler notice|article}}";
        wikitextList.push(header);
        const opinfo = formatCell({
            name: "Operator info",
            content: {
                /**
                 * proper page name
                 * (e.g. Snegurochka)
                 * Provided in: INITIAL
                 */
                name: enname.replaceAll("_", " "),
                //catname: "", // this is probably deprecated
                /**
                 * operator's profession
                 * (e.g. Vanguard)
                 * Provided in: INITIAL
                 */
                class: convertProfessionName(data.character.profession),
                /**
                 * operator's profession branch
                 * (e.g. Agent)
                 * Provided in: INITIAL
                 */
                branch: data.character.subProfessionId,
                /**
                 * operator's faction
                 * (e.g. Rhodes Island)
                 * Provided in: INITIAL
                 */
                faction: capitalizeFirst(data.character.nationId),
                /**
                 * operator's rarity
                 * (e.g. 4)
                 * Provided in: INITIAL
                 */
                rarity: data.character.rarity.replace("TIER_", ""),
                /**
                 * operator's position
                 * (e.g. Melee)
                 * Provided in: INITIAL
                 */
                position: capitalizeFirst(data.character.position.toLowerCase()),
                /**
                 * operator's tags
                 * (e.g. DP-Recovery, Fast-Redeploy)
                 * Provided in: RELEASE
                 */
                tags: data.character.tagList.join(", "),
                /**
                 * operator's trait
                 * (e.g. DP-Recovery, Fast-Redeploy)
                 * Provided in: RELEASE
                 */
                trait: data.character.description,
                /**
                 * operator's available headhunting banner
                 * (e.g. standard cn)
                 * Provided in: INITIAL
                 */
                headhunting: "",
                /**
                 * operator's description (do not mix up with trait)
                 * (e.g. "Vanguard Operator Snegurochka treats every data with utmost care.")
                 * Provided in: RELEASE
                 */
                desc: data.character.itemUsage,
                /**
                 * operator's release event
                 * (e.g. "Ato")
                 * Provided in: INITIAL
                 */
                event: "",
                /**
                 * opeartor's quote (in game) 
                 * (e.g. "Not every problem in the world has solution, but she tries to look for one.")
                 * Provided in: RELEASE
                 */
                quote: data.character.itemDesc,
                /**
                 * true if this operator is explicit to cn server
                 * (e.g. true)
                 * Provided in: INITIAL
                 */
                cn: true
            }
        });

        
        
        wikitextList.push(opinfo);
        const optab = "{{Operator tab}}";
        wikitextList.push(optab);
        const opnotice = "{{Operator notice}}";
        wikitextList.push(opnotice);

        
        //Info box
        let string1 = "";
        let string2 = "";
        for (let archive of data.handbookInfo.storyTextAudio) {
            if (archive.storyTitle.includes("基础档案")) string1 = archive.stories[0].storyText;
            if (archive.storyTitle.includes("综合体检测试")) string2 = archive.stories[0].storyText;
        }
        const opPartialInfos = parseOperatorInfoText(string1, string2);
        const opinfobox = formatCell({
            name: "Operator infobox",
            content: {
                /**
                 * operator's English or romanized name, usually same with the page name
                 * Provided in: INITIAL
                 */
                name: enname.replaceAll("_", " "), 
                /**
                 * pronounciation of the name
                 * Provided in: MANUAL
                 */
                pronunc: "",
                /**
                 * rarity, in format of `${num}star`
                 * Provided in: INITIAL
                 */
                rarity: `${data.character.rarity.replace("TIER_", "")}star`,
                /**
                 * since this page will be created before opeartor is officially released, this part will be commented out to avoid exceptions
                 * Provided in: INITIAL
                 */
                image: annotate(`\n${enname}.png:Base;\n${enname} Elite 2.png:Elite 2\n`),
                /**
                 * operator's cn name
                 * Provided in: INITIAL
                 */
                cnname: data.character.name,
                /**
                 * operator's japanese name
                 * Provided in: MANUAL
                 */
                jpname: "",
                /**
                 * operator's korean name
                 * Provided in: MANUAL
                 */
                krname: "",
                /**
                 * operator's EP
                 * Provided in: MANUAL
                 */
                theme: "",
                /**
                 * operator's basis, usually animals
                 * Provided in: MANUAL
                 */
                basis: "",
                /**
                 * operator's in-game code
                 * Provided in: RELEASE
                 */
                filename: data.summary.id,
                /**
                 * operator's archive code
                 * Provided in: RELEASE
                 */
                fileno: data.character.displayNumber,
                /**
                 * illustrator of the operator
                 * Provided in: INITIAL
                 */
                illustrator: data.charSkins[Object.keys(data.charSkins)[0]].displaySkin.drawerList.join(", "),
                /**
                 * operator realname
                 * Provided in: MANUAL
                 */
                realname: "",
                /**
                 * operator's nickname (or alternative one)
                 * Provided in: MANUAL
                 */
                othername: "",
                /**
                 * operator's name's etymology
                 * Provided in: MANUAL
                 */
                etymology: "",
                //appearance: "", // deprecated
                /**
                 * operator's Japanese voice
                 * Provided in: INITIAL
                 */
                jpcv: data.voiceLangDict.dict?.JP?.cvName?.join("") || "",
                /**
                 * operator's Mandarin voice
                 * Provided in: INITIAL
                 */
                cncv: data.voiceLangDict.dict?.CN_MANDARIN?.cvName?.join("") || "",
                /**
                 * operator's English voice
                 * Provided in: MANUAL
                 */
                encv: "",
                /**
                 * operator's Korean voice
                 * Provided in: MANUAL
                 */
                krcv: "",
                /**
                 * 
                 */
                othercv: "",
                /**
                 * 
                 */
                otherlang: "",
                /**
                 * operator's gender
                 * Provided in: INITIAL
                 */
                gender: opPartialInfos.sex,
                /**
                 * operator's battling experience, measured in time.
                 * Provided in: RELEASE
                 */
                experience: opPartialInfos.experience,
                /**
                 * operator's birthplace
                 * Provided in: RELEASE
                 */
                birthplace: opPartialInfos.origin,
                /**
                 * operator's birthdate
                 * Provided in: RELEASE
                 */
                birthdate: opPartialInfos.birthday,
                /**
                 * operator's race
                 * Provided in: RELEASE
                 */
                race: opPartialInfos.race,
                /**
                 * operator's physical height
                 * Provided in: RELEASE
                 */
                height: opPartialInfos['height']?.replace("cm", " cm") || "",
                /**
                 * operator's infection status, if infected: "Confirmed [[Infected]] by medical examination.", "Confirmed Uninfected by medical examination." vice versa
                 * Provided in: RELEASE
                 */
                infection: opPartialInfos.infected ? "Originium crystals distributed across skin surface, confirmed Infected by medical examination." : "Medical tests have confirmed that no infection is present.",
                /**
                 * rated by 8 levels: feeble, flawed, normal, standard, average, outstanding, exceptional
                 * Provided in: RELEASE
                 */
                strength: opPartialInfos.strength,
                /**
                 * see above
                 * Provided in: RELEASE
                 */
                mobility: opPartialInfos.mobility,
                /**
                 * see above
                 * Provided in: RELEASE
                 */
                endurance: opPartialInfos.endurance,
                /**
                 * see above
                 * Provided in: RELEASE
                 */
                tactical: opPartialInfos.tactical,
                /**
                 * see above
                 * Provided in: RELEASE
                 */
                skill: opPartialInfos.skill, // see above
                /**
                 * see above
                 * Provided in: RELEASE
                 */
                originium: opPartialInfos.originium,
            }
        });
        wikitextList.push(opinfobox);


        //Summary
        //const opsummary = "'''Snegurochka''' is a [[4-star|4★]] [[Ursus|Ursine]] [[Agent Vanguard]] [[Operator]] in ''[[Arknights]]'', introduced in [[Abnormal Spectrum]]."
        const opsummary = `'''${enname}''' is a [[${data.character.rarity.replace("TIER_", "")}-star|★]] [[${annotate("Manually fill in: Region")}]] [[${annotate("Manually fill in: Class")} ${convertProfessionName(data.character.profession)}]] [[Operator]] in ''[[Arknights]]'', introduced in [[${annotate("Manually fill in: Event")}]]`;
        // const summary = '''{{subst:#titleparts:{{subst:PAGENAME}}}}''' is a [[-star|★]] [[]] [[]] [[Operator]] in ''[[Arknights]]'', introduced in [[]].
        // ⬆️ this is the one provided in the boiler template.
        wikitextList.push(opsummary);
        
        



        //Statistics
        wikitextList.push("\n==Stats==");
        // This is to shown segments of statistics cell, created for convenience.
        /* THIS IS NOT HOW `statistics` is "structured" programmatically, the more important is the sequence shown!
        let statistics = {
            RANGE: {},
            HAD: {},
            RES: {},
            RDP: {},
            COST: {},
            BLOCK: {},
            ITVL: {},
            POT: {},
            E1: {},
            E2: {}
        }
        */
        let statistics = {};

        //Ranges
        let ranges = {};
        let rangesByPhases = [];
        for (let item of data.character.phases) rangesByPhases.push(item.rangeId);
        let identicalRange = true;
        for (let i = 0; i < rangesByPhases.length - 1; i++) if (rangesByPhases[i] != rangesByPhases[i+1]) identicalRange = false;
        if (identicalRange) {
            ranges["range"] = getRange(rangesByPhases[0]);
        } else {
            if (rangesByPhases[0] != rangesByPhases[1]) {
                for (let i = 0; i < rangesByPhases.length; i++) {
                    ranges[`range${i}`] = getRange(rangesByPhases[i]);
                }
            }
        }
        if (data.character.subProfessionId == "healer") ranges["range note"] = `The red squares mark the tiles where Therapists' healing is reduced due to their trait.`;
        for (let key in ranges) statistics[key] = ranges[key];

        //Collection data of Health Point, Attack, Defense, Art Resistence, Cost, Block Count
        let HADRCB = [];
        for (let i = 0; i < data.character.phases.length; i++) {
            if (i == 0) {
                HADRCB.push({
                    h: data.character.phases[i].attributesKeyFrames[0].data.maxHp,
                    a: data.character.phases[i].attributesKeyFrames[0].data.atk,
                    d: data.character.phases[i].attributesKeyFrames[0].data.def,
                    r: data.character.phases[i].attributesKeyFrames[0].data.magicResistance,
                    c: data.character.phases[i].attributesKeyFrames[0].data.cost,
                    b: data.character.phases[i].attributesKeyFrames[0].data.blockCnt,
                });
            }
            HADRCB.push({
                h: data.character.phases[i].attributesKeyFrames[data.character.phases[i].attributesKeyFrames.length - 1].data.maxHp,
                a: data.character.phases[i].attributesKeyFrames[data.character.phases[i].attributesKeyFrames.length - 1].data.atk,
                d: data.character.phases[i].attributesKeyFrames[data.character.phases[i].attributesKeyFrames.length - 1].data.def,
                r: data.character.phases[i].attributesKeyFrames[data.character.phases[i].attributesKeyFrames.length - 1].data.magicResistance,
                c: data.character.phases[i].attributesKeyFrames[data.character.phases[i].attributesKeyFrames.length - 1].data.cost,
                b: data.character.phases[i].attributesKeyFrames[data.character.phases[i].attributesKeyFrames.length - 1].data.blockCnt
            });
        }

        //Trust data
        let trust = {
            h: data.character.favorKeyFrames[data.character.favorKeyFrames.length - 1].data.maxHp,
            a: data.character.favorKeyFrames[data.character.favorKeyFrames.length - 1].data.atk,
            d: data.character.favorKeyFrames[data.character.favorKeyFrames.length - 1].data.def,
            r: data.character.favorKeyFrames[data.character.favorKeyFrames.length - 1].data.magicResistance,
        };

        //Health Point
        let HP = {};
        for (let i = 0; i < HADRCB.length; i++) {
            if (i == 0) {
                HP['hp0'] = `${HADRCB[0].h}, ${HADRCB[1].h}`;
                i++;
            } else {
                HP[`hp${i-1}`] = HADRCB[i].h;
            }
        }
        if (trust.h > 0) HP['hp trust'] = trust.h;
        for (let key in HP) statistics[key] = HP[key];

        //Attack
        let ATK = {};
        for (let i = 0; i < HADRCB.length; i++) {
            if (i == 0) {
                ATK['atk0'] = `${HADRCB[0].a}, ${HADRCB[1].a}`;
                i++;
            } else {
                ATK[`atk${i-1}`] = HADRCB[i].a;
            }
        }
        if (trust.a > 0) ATK['atk trust'] = trust.a;
        for (let key in ATK) statistics[key] = ATK[key];

        //Defense
        let DEF = {};
        for (let i = 0; i < HADRCB.length; i++) {
            if (i == 0) {
                DEF['def0'] = `${HADRCB[0].d}, ${HADRCB[1].d}`;
                i++;
            } else {
                DEF[`def${i-1}`] = HADRCB[i].d;
            }
        }
        if (trust.d > 0) DEF['def trust'] = trust.d;
        for (let key in DEF) statistics[key] = DEF[key];

        //Art Resistence
        let RES = {};
        let identicalRES = true;
        for (let i = 0; i < HADRCB.length - 1; i++) if (HADRCB[i].r != HADRCB[i+1].r) identicalRES = false;
        if (identicalRES) {
            RES['res'] = HADRCB[0].r;
        } else {
            for (let i = 0; i < HADRCB.length; i++) {
                RES[`res${i}`] = HADRCB[i].r;
            }
        }
        if (trust.r > 0) RES['res trust'] = trust.r;
        for (let key in RES) statistics[key] = RES[key];

        //Redeployment Time
        let RDP = { rdp: data.character.phases[0].attributesKeyFrames[0].data.respawnTime };
        for (let key in RDP) statistics[key] = RDP[key];

        //Deployment Costs
        let costs = {};
        for (let i = 0; i < HADRCB.length; i++) {
            costs[`cost${i}`] = HADRCB[i].c;
        }
        for (let key in costs) statistics[key] = costs[key];

        //Block Counts
        let blocks = {};
        for (let i = 0; i < HADRCB.length; i++) {
            blocks[`block${i}`] = HADRCB[i].b;
        }
        for (let key in blocks) statistics[key] = blocks[key];

        //Attack Interval
        let ITVL = { itvl: data.character.phases[0].attributesKeyFrames[0].data.baseAttackTime };
        for (let key in ITVL) statistics[key] = ITVL[key];

        //Potentials
        function readPotentialTranslation (desc) { 
            if (desc.startsWith("部署费用")) return `[[DP]] cost {{Color|${desc.replace("部署费用", "").trim()}}}`;
            if (desc.startsWith("再部署时间")) return `Redeployment time {{Color|${desc.replace("再部署时间", "").replace("秒", "").trim()} seconds}}`;
            if (desc.startsWith("生命上限")) return `Max HP {{Color|${desc.replace("生命上限", "").trim()}}}`;
            if (desc.startsWith("攻击力")) return `ATK {{Color|${desc.replace("攻击力", "").trim()}}}`;
            if (desc.startsWith("攻击速度")) return `ASPD {{Color|${desc.replace("攻击速度", "").trim()}}}`;
            if (desc.startsWith("防御力")) return `DEF {{Color|${desc.replace("防御力", "").trim()}}}`;
            if (desc.startsWith("法术抗性")) return `RES {{Color|${desc.replace("法术抗性", "").trim()}}}`;
            if (desc.includes("天赋效果增强")) {
                if (desc.includes("一")) {
                    return `Improves [[#Talent|${data.character.talents[0].candidates[0].name}]]`;
                } else if (desc.includes("二")) {
                    return `Improves [[#Talent|${data.character.talents[1].candidates[0].name}]]`;
                } else {
                    return `Improves [[#Talent|${data.character.talents[0].candidates[0].name}]]`;
                }
            }
            return desc;
        }
        let potential = {};
        for (let i = 0; i < data.character.potentialRanks.length; i++) potential[`pot${i+2}`] = readPotentialTranslation(data.character.potentialRanks[i].description);
        if (data.potentialItem != null) {
            potential['pot rarity'] = data.potentialItem.rarity.replace("TIER_", "");
            potential['pot class'] = convertProfessionName(data.character.profession);
        }
        if (!data.canUseGeneralPotentialItem && data.canUseActivityPotentialItem) potential['folder'] = true;
        for (let key in potential) statistics[key] = potential[key];

        //Elite 1
        if (data.character.phases[1]) {
            let elite1 = {};
            let e1upgradeSummary = "\n*Maximum attributes increased.";
            //DP
            if (data.character.phases[1].attributesKeyFrames[0].data.cost != data.character.phases[0].attributesKeyFrames[0].data.cost) {
                e1upgradeSummary+=`[[DP]] cost {{Color|+${data.character.phases[1].attributesKeyFrames[0].data.cost - data.character.phases[0].attributesKeyFrames[0].data.cost}|down}}.`;
            }
            //Talents
            for (let talent of data.character.talents) {
                for (let i = 0; i < talent.candidates.length; i++) {
                    if (talent.candidates[i].unlockCondition.phase == "PHASE_1" && talent.candidates[i].requiredPotentialRank == 0) {
                        if (i == 0) {
                            e1upgradeSummary+=`\n*New talent: '''${talent.candidates[i].name}'''.`;
                        } else {
                            e1upgradeSummary+=`\n*'''${talent.candidates[i].name}''' improved.`;
                        }
                    }
                }
            }
            //Skills
            for (let item of data.character.skills) {
                if (item.unlockCond.phase == "PHASE_1") {
                    e1upgradeSummary+=`\n*New skill: '''${data.charSkills[item.skillId].levels[0].name}'''.`
                }
            }
            //Range
            if (data.character.phases[1].rangeId != data.character.phases[0].rangeId) {
                e1upgradeSummary+=`\n*Range extended.`;
            }
            elite1['e1'] = e1upgradeSummary;
            elite1['e1 level'] = data.character.phases[0].attributesKeyFrames[1].level;
            switch (data.character.phases[1].attributesKeyFrames[1].level) {
                case 55:
                    elite1['e1 lmd'] = 10000;
                    break;
                case 60:
                    elite1['e1 lmd'] = 15000;
                    break;
                case 70:
                    elite1['e1 lmd'] = 20000;
                    break;
                case 80:
                    elite1['e1 lmd'] = 30000;
                    break;
            }
            for (let i = 0; i < data.character.phases[1].evolveCost.length; i++) {
                elite1[`e1 m${i+1}`] = `${annotate(data.character.phases[1].evolveCost[i].id)}, ${data.character.phases[1].evolveCost[i].count}`;
            }
            for (let key in elite1) statistics[key] = elite1[key];
        }

        //Elite 2
        if (data.character.phases[2]) {
            let elite2 = {};
            let e2upgradeSummary = "\n*Maximum attributes increased.";
            //DP
            if (data.character.phases[2].attributesKeyFrames[0].data.cost != data.character.phases[1].attributesKeyFrames[0].data.cost) {
                e2upgradeSummary+=`[[DP]] cost {{Color|+${data.character.phases[2].attributesKeyFrames[0].data.cost - data.character.phases[1].attributesKeyFrames[0].data.cost}|down}}.`;
            }
            //Talents
            for (let talent of data.character.talents) {
                for (let i = 0; i < talent.candidates.length; i++) {
                    if (talent.candidates[i].unlockCondition.phase == "PHASE_2" && talent.candidates[i].requiredPotentialRank == 0) {
                        if (i == 0) {
                            e2upgradeSummary+=`\n*New talent: '''${talent.candidates[i].name}'''.`;
                        } else {
                            e2upgradeSummary+=`\n*'''${talent.candidates[i].name}''' improved.`;
                        }
                    }
                }
            }
            //Skills
            for (let item of data.character.skills) {
                if (item.unlockCond.phase == "PHASE_2") {
                    e2upgradeSummary+=`\n*New skill: '''${data.charSkills[item.skillId].levels[0].name}'''.`
                }
            }
            //Range
            if (data.character.phases[2].rangeId != data.character.phases[1].rangeId) {
                e2upgradeSummary+=`\n*Range extended.`;
            }
            e2upgradeSummary+=`\n*[[Operator Module]]s available.`
            elite2['e2'] = e2upgradeSummary;
            elite2['e2 level'] = data.character.phases[1].attributesKeyFrames[1].level;
            switch (data.character.phases[2].attributesKeyFrames[1].level) {
                case 70:
                    elite2['e2 lmd'] = 60000;
                    break;
                case 80:
                    elite2['e2 lmd'] = 120000;
                    break;
                case 90:
                    elite2['e2 lmd'] = 180000;
                    break;
            }
            for (let i = 0; i < data.character.phases[2].evolveCost.length; i++) {
                elite2[`e2 m${i+1}`] = `${annotate(data.character.phases[2].evolveCost[i].id)}, ${data.character.phases[2].evolveCost[i].count}`;
            }
            for (let key in elite2) statistics[key] = elite2[key];
        }


        const opdata = formatCell({
            name: "Operator data",
            content: statistics
        });
        wikitextList.push(opdata);







        // Talents
        wikitextList.push("\n==Talents==");
        for (let talent of data.character.talents) {
            const talentName = talent.candidates[0].name;
            if (!talentName) continue;
            let itemList = { "PHASE_0": [], "PHASE_1": [], "PHASE_2": [] };
            for (let item of talent.candidates) {
                let isExisting = false;
                for (let phase in itemList) {
                    if (phase == item.unlockCondition.phase) {
                        itemList[phase].push({
                            condition: item.unlockCondition.phase,
                            potential: item.requiredPotentialRank,
                            description: item.description
                        });
                        isExisting = true;
                    }
                }
                if (!isExisting) {
                    itemList[item.unlockCondition.phase].push({
                        condition: item.unlockCondition.phase,
                        potential: item.requiredPotentialRank,
                        description: item.description
                    });
                }
            }
            let moreThanTwoPot = false;
            for (let key in itemList) {
                if (itemList[key].length > 2) {
                    moreThanTwoPot = true;
                    break;
                }
            }


            if (moreThanTwoPot) {
                let count = 1;
                let talentString = '';
                for (let phase in itemList) {
                    if (itemList[phase].length == 0) continue;
                    for (let item of itemList[phase]) {
                        let cond = '';
                        switch (item.condition) {
                            case "PHASE_0":
                                cond = "Base";
                                break;
                            case "PHASE_1":
                                cond = "Elite 1";
                                break;
                            case "PHASE_2":
                                cond = "Elite 2";
                                break;
                        }
                        let talentCell = { name: talentName + " " + count };
                        if (item.potential != 0) talentCell['pot1'] = item.potential + 1;
                        talentCell['cond1'] = cond;
                        talentCell['desc1'] = item.description;
                        if (count != 1) talentCell['rpl'] = talentName + " " + (count - 1);
                        talentString+=(formatCell({name: "Talent", content: talentCell}) + "\n");
                        count++;
                    }
                    wikitextList.push(talentString);
                }
            } else {
                let talentObject = { name: talentName };
                let maxNum = 0;
                for (let key in itemList) if (itemList[key].length > maxNum) maxNum = itemList[key].length;
                if (maxNum == 2) {
                    let count = 1;
                    for (let key in itemList) {
                        if (itemList[key].length == 0) continue;
                        let cond = '';
                        switch (itemList[key][0].condition) {
                            case "PHASE_0":
                                cond = "Base";
                                break;
                            case "PHASE_1":
                                cond = "Elite 1";
                                break;
                            case "PHASE_2":
                                cond = "Elite 2";
                                break;
                        }
                        talentObject['pot'] = itemList[key][1].potential + 1;
                        talentObject[`cond${count}`] = cond;
                        talentObject[`desc${count}a`] = itemList[key][0].description;
                        talentObject[`desc${count}b`] = itemList[key][1].description;
                        count++;
                    }
                } else {
                    let count = 1;
                    for (let key in itemList) {
                        if (itemList[key].length == 0) continue;
                        let cond = '';
                        switch (itemList[key][0].condition) {
                            case "PHASE_0":
                                cond = "Base";
                                break;
                            case "PHASE_1":
                                cond = "Elite 1";
                                break;
                            case "PHASE_2":
                                cond = "Elite 2";
                                break;
                        }
                        talentObject[`cond${count}`] = cond;
                        talentObject[`desc${count}`] = itemList[key][0].description;
                        count++;
                    }
                }
                wikitextList.push(formatCell({name: "Talent", content: talentObject}));
            }
        }



        // Skills
        if (Object.keys(data.character.skills).length > 0) {
            wikitextList.push("\n==Skills==");
            for (let sk of data.character.skills) {
                let skillWikitext = '';
                const skill = data.charSkills[sk.skillId];
                skillWikitext += formatCell({
                    name: "Skill head",
                    content: {
                        name: skill.levels[0].name,
                        icon: annotate(skill.skillId),
                        sp: skillRecoveryType(skill.levels[0].spData.spType),
                        type: skillActiveType(skill.levels[0].skillType),
                    }
                }, true);
                for (var i = 0; i < skill.levels.length; i++) {
                    const level = skill.levels[i];
                    skillWikitext += formatCell({
                        name: "Skill cell",
                        content: {
                            level: i+1,
                            sp: `${level.spData.initSp},${level.spData.spCost}`,
                            duration: level.duration,
                            effect: annotate(level.description)
                        }
                    }, true);
                }
                skillWikitext += "{{Skill end}}";
                wikitextList.push(`${skillWikitext}\n`);
            }
        }

        // Modules
        wikitextList.push("\n==Operator Modules==");
        for (let modId in data.charModules) {
            let moduleObject = {};
            const mod = data.charModules[modId];
            const modData = data.moduleData[modId];
            if (mod.typeIcon == "original") {
                moduleObject['title'] = "Original";
                moduleObject['type'] = "basic";
                moduleObject['branch'] = annotate("Manually fill in");
            } else {
                moduleObject['title'] = mod.typeIcon.toUpperCase();
                moduleObject['type'] = mod.typeName2.toLowerCase();
                moduleObject['module'] = mod.uniEquipName;
                moduleObject['talent'] = "";
                for (let phase of modData.phases) {
                    let breaks = false;
                    for (let part of phase.parts) {
                        if (part.target == "TALENT_DATA_ONLY") {
                            moduleObject['trait'] = "new";
                            const name = part.addOrOverrideTalentDataBundle.candidates[0].name;
                            moduleObject['talent'] = moduleObject['talent'].replaceAll(`,${name}`, "") + `,${name}`;
                            breaks = true;
                            break;
                        } else moduleObject['trait'] = annotate("");
                    }
                    if (breaks) break;
                }
                moduleObject['talent'] = annotate("original" + moduleObject['talent']);
                for (let phase of modData.phases) {
                    if (!phase.parts[phase.parts.length-1].overrideTraitDataBundle.candidates) continue;
                    moduleObject[`effect${phase.equipLevel}`] = phase.parts[phase.parts.length-1].overrideTraitDataBundle.candidates[0].additionalDescription;
                    var index = 1;
                    for (let key in phase.attributeBlackboard) {
                        moduleObject[`att${phase.equipLevel}${index}`] = `${key.replace("max_hp", "hp")},${phase.attributeBlackboard[key]}`;
                        index++;
                    }
                }
                var index = 1;
                while (data.moduleMissions[`${modId}${index}`]) {
                    moduleObject[`mission${index}`] = data.moduleMissions[`${modId}_${index}`].desc;
                    index++;
                }
                moduleObject['level'] = mod.unlockLevel;
                moduleObject['data block'];
                var index = 1;
                for (let index in mod.unlockCost) {
                    const cost = mod.unlockCost[index];
                    for (let mat of cost) {
                        if (mat.id == "mod_unlock_token") moduleObject['data block'] = mat.count;
                        else if (mat.id == "mod_unlock_token1") moduleObject['data stick'] = mat.count;
                        else if (mat.id == "mod_unlock_token2") moduleObject['data instrument'] = mat.count;
                        else if (mat.type == "MATERIAL") moduleObject[`material ${index}`.replaceAll(" 1", "")] = mat.count;
                        else if (mat.id == "4001") moduleObject[`lmd ${index}`.replaceAll(" 1", "")] = mat.count;
                    }
                }

                for (let cost of mod.itemCost["3"]) {
                    if (cost.id == "mod_unlock_token") moduleObject['data block'] = cost.count;
                    if (cost.id == "mod_unlock_token1") moduleObject['data block'] = cost.count;
                    if (cost.id == "mod_unlock_token2") moduleObject['data block'] = cost.count;
                }
            }
            moduleObject['desc'] = data.charModules[modId].uniEquipDesc.replaceAll("\n", "<br>");
            wikitextList.push(formatCell({
                name: "Operator module",
                content: moduleObject
            }));
        }


        // Base Skills
        let baseString = "===Base Skills===\n";
        let baseObject = {};
        var index = 1;
        for (let bs of data.baseSkills.buffChar) {
            if (!(bs.buffData.length > 0)) continue;
            for (var i = 0; i < bs.buffData.length; i++) {
                baseObject[`id${index}`] = bs.buffData[i].buffId;
                if (bs.buffData[i].cond.phase != "PHASE_0") baseObject[`cond${index}`] = phaseToElite(bs.buffData[i].cond.phase);
                index++;
            }
        }
        baseString += formatCell({
            name: "Base skills",
            content: baseObject
        });
        wikitextList.push((baseString));

        wikitextList.push("===Changelog===");

        wikitextList.push("{{Operators}}");

        return wikitextList.join("\n");
    }


    /**
     * Add-on skins modification of ~/OPERATOR/Gallery page.
     * @param {object} data The data regarding the operator
     * @param {string} original The original wikitext of the targeted operator gallery page, for modification use.
     * @param {string} enname The page name of the operator (usually English).
     * @returns {string} The final wikitext (composed of original and generated) for the operator gallery section.
     */
    static op_gallery_skin (data, original, enname) {
        let wikitextList = [];
        const origList = original.split("==Sprites==");
        wikitextList.push(origList[0]);
        const origFirst = origList[0].split("\n");
        
        let existSkinCount = 0;
        for (let line of origFirst) {
            const segments = line.split(" = ");
            if (segments.length > 1 && segments[0].trim().includes("|no")) if (parseInt(segments[1].trim()) > existSkinCount) existSkinCount = parseInt(segments[1].trim());
        }
        if (existSkinCount == 0) wikitextList.push("\n\n==Outfits==");
        if (!origList[0].includes("{{Translation|section")) wikitextList.push("{{Translation|section}}");
        const skin = data.charSkins[Object.keys(data.charSkins)[Object.keys(data.charSkins).length - 1]];
        wikitextList.push(formatCell({
            name: "Operator skin",
            content: {
                no: existSkinCount + 1,
                name: skin.displaySkin.skinName,
                use: skin.displaySkin.usage,
                quote: skin.displaySkin.description,
                series: skin.displaySkin.skinGroupName,
                desc: skin.displaySkin.dialog.replace(`${skin.displaySkin.skinGroupName}. `, ""),
                obtain: annotate("Manually fill in"),
            }
        }));
        wikitextList.push("\n==Sprites==");
        let spriteString = origList[1].replace("</gallery>", `${enname} Skin ${existSkinCount+1}.webm|gif|${enname}'s ''${skin.displaySkin.skinName}''Outfit Sprite\n</gallery>`);
        wikitextList.push(spriteString);
        return wikitextList.join("\n");
    }

    /**
     * Initialization of ~/OPERATOR/Gallery page.
     * @param {string} enname The page name of the operator (usually English).
     * @param {boolean} noe2 True if the operator does not have a E2 art.
     * @returns {string} Returns the generated wikitext for the operator gallery section.
     */
    static op_gallery (enname, noe2) {
        let wikitext = `{{Operator tab}}\n\n==Skins==\n{{Operator skin\n|name = base}}\n{{Operator skin\n|name = e2}}\n\n==Sprites==\n<gallery widths=360px>\n${enname}.webm|gif|${enname}'s Base Sprite\n</gallery>`;
        if (noe2) wikitext = wikitext.replace("\n{{Operator skin\n|name = e2}}", "");
        return wikitext;
    }

    /**
     * Initialization of ~/OPERATOR/Dialogue page.
     * @param {string} enname The page name of the operator (usually English).
     * @param {Array} data The data array containing necessary information.
     * @param {number} data[].voiceIndex The index of the voiceline of the whole dialogue set.
     * @param {string} data[].voiceText The content of the piece of voiceline.
     * @returns {string} Returns the generated wikitext for the operator dialogues section.
     */
    static op_dialogue (enname, data) {
        let wikitext = "{{Operator tab}}\n{{Translation|article}}\n{{Operator dialogue head}}\n";
        let footer = `{{Table end}}\n\n[[Category: ${enname}]]\n[[Category: Operator dialogues]]\n`;
        for (let key in data) wikitext+=`{{Operator dialogue cell2|no=${data[key].voiceIndex}|dialogue=${data[key].voiceText}}}\n`;
        return wikitext + footer;
    }

    /**
     * Modification of ~/OPERATOR/File page, prescence of /File page is assumed due to the prior execution of op_intro() 
     * @param {Array} data The data object containing necessary information. 
     * @param {string} data[].storyTitle The title of the archive segment.
     * @param {Array} data[].stories The array of story objects.
     * @param {string} data[].stories[].storyText The text content of the story.
     * @param {string} original The original wikitext of the targeted operator file page, for modification use.
     * @param {string} enname The desired page name of the operator. (It might not necessarily be English!)
     * @returns {string} Returns the generated wikitext for the operator files section.
     */
    static op_file (data, original, enname) {
        let wikitext = "{{Operator tab}}\n{{Translation|article}}\n";
        let footer = `[[Category: ${enname}]]\n[[Category: Operator files]]\n`;
        //if (original.includes(`[[Category: ${enname}]]`)) footer = footer.replace(`[[Category: ${enname}]]\n`, "");
        //if (original.includes(`[[Category: Operator files]]`)) footer = footer.replace(`[[Category: Operator files]]\n`, "");
        //const originalLines = original.split("\n");
        //let index = 0;
        /*
        while (index < originalLines.length) {
            if (originalLines[index].startsWith("{{Operator tab}}")) wikitext = wikitext.replace("{{Operator tab}}\n", "");
            if (originalLines[index].startsWith("{{Translation|article}}")) wikitext = wikitext.replace("{{Translation|article}}\n", "");
            if (originalLines[index].startsWith("{{Operator intro")) break;
            index++;
        }*/
        const reference = {
            客观履历: "Profile",
            临床诊断分析: "Clinical Analysis",
            档案资料一: "Archive File 1",
            档案资料二: "Archive File 2",
            档案资料三: "Archive File 3",
            档案资料四: "Archive File 4",
            晋升记录: "Promotion Record"
        }
        for (let item of data) {
            let cell = '{{Archive\n';
            if (item.storyTitle == "客观履历"
                || item.storyTitle == "临床诊断分析"
                || item.storyTitle == "档案资料一"
                || item.storyTitle == "档案资料二"
                || item.storyTitle == "档案资料三"
                || item.storyTitle == "档案资料四"
                || item.storyTitle == "晋升记录"
            ) {
                cell += `|title = ${reference[item.storyTitle]}\n`;
                cell += `|text = ${item.stories[0].storyText.replaceAll("\n", "<br/>")}}}\n`;
                wikitext += cell;
            }
        }
        //originalLines.splice(index, 0, wikitext);
        return wikitext + footer;
        return originalLines.join('\n') + '\n' + footer;
    }

    /**
     * Initialization of ~/OPERATOR/File
     * @param {Object} data The data object containing necessary information.
     * @param {string} data.text The original text to be processed.
     * @param {string} data.source The source URL of the text.
     * @returns {object} Returns an object containing the generated wikitext and the operator name.
     */
    static op_intro (data) {
        let op_name = '';
        const lines = data.text.split("\n");
        let isText = false;
        let isQuote = false;
        let text = '';
        let quote = '';
        for (let item of lines) {
            if (item.startsWith("//")) {
                op_name = item.replace("//", "").trim();
            }
            if (item.startsWith('“')) {
                isQuote = true;
            }
            if (isText) {
                text = text + item + '<br>';
            } else if (isQuote) {
                if (item.startsWith('___')) {
                    isQuote = false;
                    isText = true;
                } else if (item != '') {
                    quote = quote + item + '<br>';
                }
            }
        }
        const wikitext = `{{Operator intro\n|translator = \n|quote = ${quote.replace(/^<br>|<br>$/g, '').replace(/^“|”$/g, '')}\n|text = ${text.replace(/^<br>|<br>$/g, '')}\n|source = ${data.source}}}`;
        return {
            wikitext: wikitext,
            name: op_name
        };
    }
}

const formatCell = (data, inline) => {
    if (typeof(data) == "object") {
        let wikitext = `{{${data.name}`;
        if (!inline) wikitext+="\n";
        for (let key in data.content) {
            wikitext+=`|${key} = ${data.content[key]}`;
            if (!inline) wikitext+="\n";
        }
        if (wikitext.endsWith("\n")) wikitext = wikitext.substring(0, wikitext.length - 1);
        return wikitext + "}}\n";
    } else {
        let wikitext = `{{${data[0]}\n`;
        for (var i = 1; i < data.length; i++) wikitext+=`|${data[i]}`;
        return wikitext + "}}\n";
    }
}

/**
 * Parsing wikitext inscribed in templates, only supporting some of the templates.
 * @param {string} wikitext The wikitext CELL that needs to be parsed. It should be using an template and the formate has to be in:
 * {{name
 * |a = apple
 * |b = banana
 * |...}}.
 * @returns {object} Supposedly parsed wikitext.
 */
const parseCell = (wikitext) => {
    wikitext = wikitext.replace(/}}$/, "");
    let cell = { name: "", content: {} };
    const textList = wikitext.split("\n|");
    cell['name'] = textList[0].replaceAll("\n", "").replaceAll("{{", "");
    for (let item of textList) {
        if (item.includes("=")) {
            let string = item.replace(/\n$/, "");
            if (string.startsWith("\n")) string = string.replace("\n", "");
            const splitted = string.split("=");
            const left = splitted[0].trim();
            const right = splitted.join("").replace(left, "").trim();
            cell['content'][left] = right;
        }
    }
    return cell;
}

const convertProfessionName = (name) => {
    switch (name) {
        case "PIONEER":
            return "Vanguard";
        case "WARRIOR":
            return "Guard";
        case "SNIPER":
            return "Sniper";
        case "CASTER":
            return "Caster";
        case "MEDIC":
            return "Medic";
        case "TANK":
            return "Specialist";
        case "SUPPORT":
            return "Supporter";
        case "SPECIAL":
            return "Specialist";
    }
}

const skillRecoveryType = (sp) => {
    switch (sp) {
        case "INCREASE_WITH_TIME":
            return "auto";
        case "INCREASE_WHEN_ATTACK":
            return "attack";
        case "INCREASE_WITH_DAMAGE":
            return "damage";
        default:
            return annotate("unknown");
    }
}

const skillActiveType = (id) => {
    switch (id) {
        case "MANUAL":
            return "manual";
        case "AUTO":
            return "auto";
        case "PASSIVE":
            return "passive";
        default:
            return annotate("unknown");
    }
}

const phaseToElite = (string) => {
    switch (string) {
        case "PHASE_0":
            return "Elite 0";
        case "PHASE_1":
            return "Elite 1";
        case "PHASE_2":
            return "Elite 2";
        default:
            return annotate("unknown");
    }
}

const physicalExamination = (string) => {
    const map = {
        卓越: "Outstanding/Exceptional",
        优良: "Excellent",
        标准: "Standard",
        普通: "Normal/Average",
        缺陷: "Flawed"
    }
    return map[string] || annotate("unknown: " + string);
}

const parseOperatorInfoText = (string1, string2) => {
    const lines = string1.split("\n");
    let obj = {};
    let scanInfectionStatus = false;
    for (let line of lines) {
        if (scanInfectionStatus) {
            obj['infected'] = !(line.includes("非感染"));
            scanInfectionStatus = false;
            continue;
        }
        if (line.includes("代号")) obj['codename'] = line.split("】")[1].trim();
        if (line.includes("性别")) obj['sex'] = line.split("】")[1].trim();
        if (line.includes("经验")) obj['experience'] = line.split("】")[1].trim();
        if (line.includes("出身地")) obj['origin'] = line.split("】")[1].trim();
        if (line.includes("生日")) obj['birthday'] = line.split("】")[1].trim();
        if (line.includes("种族")) obj['race'] = line.split("】")[1].trim();
        if (line.includes("身高")) obj['height'] = line.split("】")[1].trim();
        if (line.includes("矿石病感染情况")) scanInfectionStatus = true;
    }
    const lines2 = string2.split("\n");
    for (let line of lines2) {
        if (line.includes("物理强度")) obj['strength'] = physicalExamination(line.split("】")[1].trim());
        if (line.includes("战场机动")) obj['mobility'] = physicalExamination(line.split("】")[1].trim());
        if (line.includes("生理耐受")) obj['endurance'] = physicalExamination(line.split("】")[1].trim());
        if (line.includes("战术规划")) obj['tactical'] = physicalExamination(line.split("】")[1].trim());
        if (line.includes("战斗技巧")) obj['skill'] = physicalExamination(line.split("】")[1].trim());
        if (line.includes("源石技艺适应性")) obj['originium'] = physicalExamination(line.split("】")[1].trim());
    }
    return obj;
}

const skillDesc = (string) => {
    let result = '';
    const strings = string.split("</>");
    for (let item of strings) {
        if (item.includes("<")) {
        }
    }
}

const skillDescTags = [
    "<@ba.kw>",
    "<@ba.rem>",
    "<@ba.vup>",
    "<@ba.vdown>"
]

const annotate = (content) => {
    return `<!-- ${content} -->`;
}

const capitalizeFirst = str => str.charAt(0).toUpperCase() + str.slice(1);

const getRange = (rangeId) => {
    const range = {
        "0-1": "{{Ranges|p|p|s|p|p}}",
        "1-1": "{{Ranges|p|p|s|r|p|p}}",
        "1-2": "{{Ranges|r|p}}\n{{Ranges|s|r}}\n{{Ranges|r|p}}",
        "1-3": "{{Ranges|p|r}}\n{{Ranges|s|r}}\n{{Ranges|p|r}}",
        "1-4": "{{Ranges|r|r}}\n{{Ranges|s|r}}\n{{Ranges|r|r}}",
        "2-1": "{{Ranges|r|p|p}}\n{{Ranges|r|r|p}}\n{{Ranges|s|r|r}}\n{{Ranges|r|r|p}}\n{{Ranges|r|p|p}}",
        "2-2": "{{Ranges|s|r|r}}",
        "2-3": "{{Ranges|r|r|p}}\n{{Ranges|s|r|r}}\n{{Ranges|r|r|p}}",
        "2-4": "{{Ranges|p|r|p}}\n{{Ranges|s|r|r}}\n{{Ranges|p|r|p}}",
        "2-5": "{{Ranges|p|r|r}}\n{{Ranges|s|r|r}}\n{{Ranges|p|r|r}}",
        "2-6": "{{Ranges|p|p|r}}\n{{Ranges|p|r|r}}\n{{Ranges|s|r|r}}\n{{Ranges|p|r|r}}\n{{Ranges|p|p|r}}",
        "3-1": "{{Ranges|r|r|r|p}}\n{{Ranges|s|r|r|r}}\n{{Ranges|r|r|r|p}}",
        "3-2": "{{Ranges|s|r|r|r}}",
        "3-3": "{{Ranges|r|r|r|r}}\n{{Ranges|s|r|r|r}}\n{{Ranges|r|r|r|r}}",
        "3-4": "{{Ranges|r|r|r|p}}\n{{Ranges|r|r|r|r}}\n{{Ranges|s|r|r|r}}\n{{Ranges|r|r|r|r}}\n{{Ranges|r|r|r|p}}", // Identical with 3-15, but Lumen used 3-4 and Mostima skill used 3-15
        "3-5": "{{Ranges|r|r|p}}\n{{Ranges|r|r|r}}\n{{Ranges|s|r|r}}\n{{Ranges|r|r|r}}\n{{Ranges|r|r|p}}",
        "3-6": "{{Ranges|r|r|r}}\n{{Ranges|s|r|r}}\n{{Ranges|r|r|r}}",
        "3-7": "{{Ranges|r|p|p|p}}\n{{Ranges|r|r|p|p}}\n{{Ranges|r|r|r|p}}\n{{Ranges|s|r|r|r}}\n{{Ranges|r|r|r|p}}\n{{Ranges|r|r|p|p}}\n{{Ranges|r|p|p|p}}",
        "3-8": "{{Ranges|r|r|r|r|p}}\n{{Ranges|s|r|r|r|r}}\n{{Ranges|r|r|r|r|p}}",
        "3-9": "{{Ranges|r|r|r|p|p}}\n{{Ranges|r|r|r|r|p}}\n{{Ranges|s|r|r|r|r}}\n{{Ranges|r|r|r|r|p}}\n{{Ranges|r|r|r|p|p}}",
        "3-10": "{{Ranges|r|r|r|r|r}}\n{{Ranges|s|r|r|r|r}}\n{{Ranges|r|r|r|r|r}}",
        "3-12": "{{Ranges|r|r|p|p|p}}\n{{Ranges|s|r|r|r|r}}\n{{Ranges|r|r|p|p|p}}",
        "3-13": "{{Ranges|p|r|r|p}}\n{{Ranges|s|r|r|r}}\n{{Ranges|p|r|r|p}}",
        "3-14": "{{Ranges|p|r|r|r}}\n{{Ranges|s|r|r|r}}\n{{Ranges|p|r|r|r}}",
        "3-15": "{{Ranges|r|r|r|p}}\n{{Ranges|r|r|r|r}}\n{{Ranges|s|r|r|r}}\n{{Ranges|r|r|r|r}}\n{{Ranges|r|r|r|p}}",
        "3-16": "{{Ranges|s|p|p|r}}",
        "3-17": "{{Ranges|p|r|r|r}}\n{{Ranges|r|r|r|r}}\n{{Ranges|s|r|r|r}}\n{{Ranges|r|r|r|r}}\n{{Ranges|p|r|r|r}}",
        "3-18": "{{Ranges|r|r|p|p}}\n{{Ranges|r|r|r|p}}\n{{Ranges|s|r|r|r}}\n{{Ranges|r|r|r|p}}\n{{Ranges|r|r|p|p}}",
        "3-19": "{{Ranges|r|p|p|p}}\n{{Ranges|r|p|p|p}}\n{{Ranges|r|p|p|p}}\n{{Ranges|s|r|r|r}}\n{{Ranges|r|p|p|p}}\n{{Ranges|r|p|p|p}}\n{{Ranges|r|p|p|p}}",
        "3-21": "{{Ranges|r|r|p|p}}\n{{Ranges|r|r|r|r}}\n{{Ranges|s|r|r|r}}\n{{Ranges|r|r|r|r}}\n{{Ranges|r|r|p|p}}",
        "4-1": "{{Ranges|s|r|r|r|r}}",
        "4-3": "{{Ranges|p|p|r|r|p}}\n{{Ranges|p|p|r|r|r}}\n{{Ranges|s|p|r|r|r}}\n{{Ranges|p|p|r|r|r}}\n{{Ranges|p|p|r|r|p}}",
        "4-4": "{{Ranges|p|p|r|r|r}}\n{{Ranges|s|p|r|r|r}}\n{{Ranges|p|p|r|r|r}}",
        "4-5": "{{Ranges|p|p|p|r|r}}\n{{Ranges|s|p|p|r|r}}\n{{Ranges|p|p|p|r|r}}",
        "4-6": "{{Ranges|p|p|p|r|r|p}}\n{{Ranges|s|p|p|r|r|r}}\n{{Ranges|p|p|p|r|r|p}}",
        "4-9": "{{Ranges|r|r|p|p|p}}\n{{Ranges|s|r|r|r|r}}\n{{Ranges|r|r|p|p|p}}",
        "4-10": "{{Ranges|r|p|p|p|p}}\n{{Ranges|r|r|p|p|p}}\n{{Ranges|s|r|r|r|r}}\n{{Ranges|r|r|p|p|p}}\n{{Ranges|r|p|p|p|p}}",
        "4-11": "{{Ranges|p|p|r|p|p}}\n{{Ranges|p|r|r|r|p}}\n{{Ranges|s|r|r|r|r}}\n{{Ranges|p|r|r|r|p}}\n{{Ranges|p|p|r|p|p}}",
        "5-1": "{{Ranges|s|r|r|r|r|r}}",
        "6-1": "{{Ranges|s|r|r|r|r|r|r}}",
        "x-1": "{{Ranges|p|p|r|p|p}}\n{{Ranges|p|r|r|r|p}}\n{{Ranges|r|r|s|r|r}}\n{{Ranges|p|r|r|r|p}}\n{{Ranges|p|p|r|p|p}}",
        "x-2": "{{Ranges|p|r|r|r|p}}\n{{Ranges|r|r|r|r|r}}\n{{Ranges|r|r|s|r|r}}\n{{Ranges|r|r|r|r|r}}\n{{Ranges|p|r|r|r|p}}",
        "x-4": "{{Ranges|r|r|r}}\n{{Ranges|r|s|r}}\n{{Ranges|r|r|r}}",
        "x-5": "{{Ranges|p|r|p}}\n{{Ranges|r|s|r}}\n{{Ranges|p|r|p}}",
        "x-6": "{{Ranges|p|p|r|p|p}}\n{{Ranges|p|p|r|p|p}}\n{{Ranges|r|r|s|r|r}}\n{{Ranges|p|p|r|p|p}}\n{{Ranges|p|p|r|p|p}}",
        "y-1": "{{Ranges|r|r|r|p}}\n{{Ranges|r|s|r|r}}\n{{Ranges|r|r|r|p}}",
        "y-2": "{{Ranges|r|r|r|r}}\n{{Ranges|r|s|r|r}}\n{{Ranges|r|r|r|r}}",
        "x-3": "{{Ranges|p|p|p|r|p|p|p}}\n{{Ranges|p|p|r|r|r|p|p}}\n{{Ranges|p|r|r|r|r|r|p}}\n{{Ranges|r|r|r|s|r|r|r}}\n{{Ranges|p|r|r|r|r|r|p}}\n{{Ranges|p|p|r|r|r|p|p}}\n{{Ranges|p|p|p|r|p|p|p}}",
        "y-4": "{{Ranges|r|r|r|p|p}}\n{{Ranges|r|r|r|r|p}}\n{{Ranges|r|s|r|r|r}}\n{{Ranges|r|r|r|r|p}}\n{{Ranges|r|r|r|p|p}}",
        "y-6": "{{Ranges|p|r|r|p}}\n{{Ranges|r|r|r|r}}\n{{Ranges|r|s|r|r}}\n{{Ranges|r|r|r|r}}\n{{Ranges|p|r|r|p}}",
        "y-7": "{{Ranges|r|r|r|r|r}}\n{{Ranges|r|s|r|r|r}}\n{{Ranges|r|r|r|r|r}}",
        "y-8": "{{Ranges|r|r|r|r|p}}\n{{Ranges|r|r|r|r|r}}\n{{Ranges|r|s|r|r|r}}\n{{Ranges|r|r|r|r|r}}\n{{Ranges|r|r|r|r|p}}",
        "y-10": "{{Ranges|r|r|r|p}}\n{{Ranges|r|r|r|r}}\n{{Ranges|r|s|r|r}}\n{{Ranges|r|r|r|r}}\n{{Ranges|r|r|r|p}}"
    }
    return range[rangeId];
}


//only for test use
async function test () {
    const name = "Bellone";
    await source.writeBuffer(template.op_main(await source.readOperatorFile(name), name));
}

//test();