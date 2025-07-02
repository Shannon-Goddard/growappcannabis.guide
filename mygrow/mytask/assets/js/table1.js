document.addEventListener('DOMContentLoaded', function() {
    setTimeout(async function() {
        const table = $('#table1');
        const tableSection = $('#table1-section');
        const wateringPrompt = $('#watering-prompt');

        const today = new Date();
        const formattedToday = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`; // e.g., "5/20/2025"

        const headers = [
            'MyGrow', 'Date', 'Stage', 'Week', 'Day', 'Visual Inspection', 'Amount Of Water', 'Ph Goal',
            'VooDoo Juice', 'Big Bud', 'B-52', 'Overdrive', 'Piranha', 'Bud Candy', 'Final Phaze', 'Tarantula',
            'Nirvana', 'Sensizym', 'Bud Ignitor', 'Rhino Skin', 'Bud Factor X', 'pH Perfect® Grow',
            'pH Perfect® Micro', 'pH Perfect® Bloom', 'GROW Powder', 'CAL/MAG Powder', 'BLOOM Powder',
            'BOOST Powder', 'CARBOFLUSH Powder', 'Mammoth Grow Me™', 'Mammoth Protect Me™', 'BioThrive® Grow',
            'BioThrive® Bloom', 'FloraGro®', 'FloraBloom®', 'FloraMicro®', 'Calmag', 'Root·Juice', 'Bio·Grow',
            'Fish·Mix', 'Bio·Bloom', 'Top·Max', 'Bio·Heaven', 'Alg·A·Mic', 'Acti·Vera', 'alga grow. (promix.)',
            'alga bloom. (promix.)', 'alga bloom. (allmix.)', 'terra grow. (lightmix.)', 'terra bloom. (lightmix.)',
            'terra bloom. (gromix.)', 'cocos a.', 'cocos b.', 'hydro a.', 'hydro b.', 'power roots.', 'pure zym.',
            'green sensation.', 'sugar royal.', 'power buds.', 'hydro roots.', 'vita race.', 'B.C Grow', 'B.C Boost',
            'B.C Bloom', 'Sugar Daddy', 'ROOT 66', 'Thrive Alive B-1 Red', 'Thrive Alive B-1 Green', 'MagiCal',
            'Awesome Blossoms', 'Rootech Cloning Gel', 'Big Bloom®', 'Grow Big®', 'Tiger Bloom®', 'Boomerang®',
            'Kangaroots®', 'Microbe Brew®', 'Wholly Mackerel®', 'Kelp Me Kelp You®', 'Bembé®', 'Open Sesame®',
            'Beastie Bloomz®', 'Cha Ching®', 'Worm Castings', 'All Purpose', 'Power Bloom', 'Glacial Rock Dust',
            'Super Fly', 'Greensand', 'Feather Meal', 'Mineralized Phosphate', 'Soluble Seaweed Extract', 'Biofuel™',
            'Continuµm™', 'Dune™', 'Lumina™', 'Nero™ SC', 'Tribus® Original', 'Tundra™', 'Cal-Mag® Plus',
            'Pure Blend® Pro Grow', 'Pure Blend® Pro Bloom', 'Liquid Karma®', 'Hydroplex®', 'Sweet® Raw',
            'Hydrogaurd®', 'Rhizo Blast®', 'FloraNova Grow', 'FloraNova Bloom', 'Pro-TeKt®', 'Foliage-Pro®',
            'BLOOM™', 'Mag-Pro®', 'K-L-N Rooting Concentrate™', 'Notes'
        ];

        const wateringColumns = [
            'AmountOfWater', 'VooDooJuice', 'BigBud', 'B52', 'Overdrive', 'Piranha', 'BudCandy', 'FinalPhaze',
            'Tarantula', 'Nirvana', 'Sensizym', 'BudIgnitor', 'RhinoSkin', 'BudFactorX', 'pHPerfectGrow',
            'pHPerfectMicro', 'pHPerfectBloom', 'GROWPowder', 'CALMAGPowder', 'BLOOMPowder', 'BOOSTPowder',
            'CARBOFLUSHPowder', 'MammothGardenGrowMe', 'MammothGardenProtectMe', 'BioThriveGrow', 'BioThriveBloom',
            'FloraGro', 'FloraBloom', 'FloraMicro', 'BioBizzCalmag', 'RootJuice', 'BioGrow', 'FishMix', 'BioBloom',
            'TopMax', 'BioHeaven', 'AlgAMic', 'ActiVera', 'algagrowpm', 'algabloompm', 'algabloomam',
            'terragrowlm', 'terrabloomlm', 'terrabloomgm', 'cocosa', 'cocosb', 'hydroa', 'hydrob', 'powerroots',
            'purezym', 'greensensation', 'sugarroyal', 'powerbuds', 'hydroroots', 'vitarace', 'BCGrow', 'BCBoost',
            'BCBloom', 'SugarDaddy', 'ROOT66', 'ThriveAliveRed', 'ThriveAliveGreen', 'MagiCal', 'AwesomeBlossoms',
            'RootechCloningGel', 'BigBloom', 'GrowBig', 'TigerBloom', 'Boomerang', 'Kangaroots', 'MicrobeBrew',
            'WhollyMackerel', 'KelpMeKelpYou', 'Bembe', 'OpenSesame', 'BeastieBloomz', 'ChaChing', 'WormCastings',
            'AllPurpose', 'PowerBloom', 'GlacialRockDust', 'SuperFly', 'Greensand', 'FeatherMeal',
            'MineralizedPhosphate', 'SolubleSeaweedExtract', 'Biofuel', 'Continum', 'Dune', 'Lumina', 'NeroSC',
            'TribusOriginal', 'Tundra', 'CalMag', 'PUREBLENDPROGROW', 'PUREBLENDPROBLOOM', 'LIQUIDKARMA',
            'HYDROPLEX', 'SWEETRAW', 'HYDROGUARD', 'RHIZOBLAST', 'FloraNovaGrow', 'FloraNovaBloom', 'ProTekt',
            'FoliagePro', 'BLOOM', 'MagPro', 'KLN'
        ];

        const renderTable = (schedule, growId) => {
            table.html('');
            const thead = $('<thead></thead>');
            const headerRow = $('<tr></tr>');
            headers.forEach(header => {
                const th = $('<th></th>').text(header);
                headerRow.append(th);
            });
            thead.append(headerRow);
            table.append(thead);

            const tbody = $('<tbody></tbody>');
            const todayData = schedule[formattedToday];
            if (todayData) {
                const row = $('<tr></tr>');
                headers.forEach(header => {
                    const key = header.replace(/[^a-zA-Z0-9]/g, '');
                    const td = $('<td></td>').text(todayData[key] || '');
                    td.attr('contenteditable', 'true');
                    td.attr('data-date', formattedToday);
                    td.attr('data-key', key);
                    row.append(td);
                });
                tbody.append(row);
            }
            table.append(tbody);

            // Add event listeners after rendering
            table.on('input', 'td', async function() {
                const td = $(this);
                const date = td.attr('data-date');
                const key = td.attr('data-key');
                const newValue = td.text().trim();

                const updatedSchedule = await IndexedDBService.loadSchedule(growId);
                if (updatedSchedule[date]) {
                    updatedSchedule[date][key] = newValue;
                    await IndexedDBService.saveSchedule(growId, updatedSchedule);
                }
            });

            $('#waterYes').on('click', async () => {
                wateringPrompt.hide();
            });

            $('#waterNo').on('click', async () => {
                const updatedSchedule = await IndexedDBService.loadSchedule(growId);
                if (updatedSchedule[formattedToday]) {
                    wateringColumns.forEach(col => {
                        updatedSchedule[formattedToday][col] = '';
                    });
                    await IndexedDBService.saveSchedule(growId, updatedSchedule);
                    renderTable(updatedSchedule, growId);
                }
                wateringPrompt.hide();
            });
        };

        try {
            // Get the selected growId from localStorage
            const growId = localStorage.getItem('selectedGrowId');
            if (!growId) {
                console.error('No selected growId found in localStorage');
                tableSection.hide();
                return;
            }

            let schedule = await IndexedDBService.loadSchedule(growId);
            if (schedule && schedule[formattedToday]) {
                renderTable(schedule, growId);
                wateringPrompt.show();

                table.css({
                    'width': '100%',
                    'border-collapse': 'collapse',
                    'margin': '20px 0'
                });

                table.find('th, td').css({
                    'border': '1px solid #ddd',
                    'padding': '8px',
                    'text-align': 'left'
                });
            } else {
                tableSection.hide();
            }
        } catch (error) {
            console.error('Error initializing table1:', error);
            tableSection.hide();
        }
    }, 100);
});