Vue.component('data-center', {
    data: function () {
        return {
            loading: true,
            coloInfo: null,
            errorMessage: '',
            darkMode: true,
        };
    },
    created: function () {
        this.fetchDataCenterInfo();
        this.applyDarkMode();
    },
    watch: {
        darkMode: function () {
            this.applyDarkMode();
        }
    },
    methods: {
        async fetchDataCenterInfo() {
            try {
                const colosDataResponse = await fetch('colos.json');
                const colosData = await colosDataResponse.json();
                const traceResponse = await fetch('https://www.cloudflare.com/cdn-cgi/trace');
                const traceText = await traceResponse.text();
        
                const coloLine = traceText.split('\n').find(line => line.startsWith('colo='));
                if (coloLine) {
                    const coloCode = coloLine.split('=')[1];
                    if (colosData[coloCode]) {
                        this.coloInfo = colosData[coloCode];
                    } else {
                        this.errorMessage = 'No matching Cloudflare data centre information found';
                    }
                } else {
                    this.errorMessage = 'Unable to parse Cloudflare data centre information';
                }
            } catch (error) {
                this.errorMessage = 'Detection failed, please check network connection';
            }
        
            this.loading = false; 
        },
        toggleDarkMode() {
            this.darkMode = !this.darkMode;
            this.applyDarkMode();
        },
    
        applyDarkMode() {
            document.body.style.backgroundColor = this.darkMode ? '#212529' : '#fff';
            document.body.style.color = this.darkMode ? 'white' : 'black';
        },
        flagUrl(countryCode) {
            return `https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/flags/4x3/${countryCode.toLowerCase()}.svg`;
        }
    },
    computed: {
        cardStyle: function () {
            return {
                backgroundColor: this.darkMode ? '#343a40' : '#fff',
                color: this.darkMode ? 'white' : 'black'
            };
        }
    },
    template: `
        <div class="text-center">
            <div class="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <img src="./favicon.ico" alt="Cloudflare Logo" style="height: 50px;">
                    <span style="font-size: 1.5rem; vertical-align: middle; margin-left: 10px;">Cloudflare Center Detector</span>
                </div>
                <i :class="['fas', darkMode ? 'fa-sun' : 'fa-moon', 'fa-2x']" @click="toggleDarkMode" style="cursor: pointer;"></i>
            </div>
            
            <div class="card mx-auto" :style="cardStyle" style="max-width: 500px;">
                <div class="card-body">
                    
                    <div v-if="loading" class="spinner-grow text-primary" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                    <div v-else-if="coloInfo" class="card-text">
                        <p class="mb-2">You are currently hitting:</p>
                        <img :src="flagUrl(coloInfo.cca2)" alt="Flag" class="img-fluid mb-2" style="height: 20px;">
                        <p class="mb-0">{{ coloInfo.region }} - {{ coloInfo.city }} ({{ coloInfo.cca2 }})</p>
                    </div>
                    <p v-else>{{ errorMessage }}</p>
                </div>
            </div>
            <div v-if="coloInfo" class="card mx-auto mt-4" :style="cardStyle" style="max-width: 500px;">
            <div class="card-body">
                <h5 class="card-title mb-3">Data centre location</h5>
                <iframe
                    width="100%"
                    height="250"
                    frameborder="0" style="border:0"
                    :src="'https://www.google.com/maps?q=' + coloInfo.lat + ',' + coloInfo.lon + '&z=8&output=embed'"
                    allowfullscreen>
                </iframe>
            </div>
        </div>

        <div class="footer mt-5" style="color: gray; font-size: 0.8rem; display: flex; justify-content: center; align-items: center; gap: 15px;">
        <!-- 
            COPYRIGHT NOTICE
            Developers are advised not to alter or remove the copyright information below.
            This project is licensed under the GNU General Public License v3.0.
            Modification of the copyright information is against the terms of the license.
            
            版权声明
            建议开发者不要更改或删除下方的版权信息。
            本项目根据 GNU 通用公共许可证 v3.0 授权。
            修改版权信息将违反许可证条款。
        -->
        <p>Follows the <a href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank" style="color: inherit; text-decoration: none;"><i class="fas fa-code"></i> GNU General Public License v3.0</a></p>
            <p><a href="https://github.com/WizisCool/Cloudflare-Center-Detector" target="_blank" style="color: inherit; text-decoration: none;"><i class="fab fa-github"></i> Cloudflare Center Detector</a></p>
            <p><a href="https://dooo.ng" target="_blank" style="color: inherit; text-decoration: none;"><i class="fas fa-blog"></i> Dooo.ng</a></p>
        </div>
        <!-- End of Copyright Notice 
             版权声明结束
        -->

    </div>
    `
});

new Vue({ el: '#app' });
