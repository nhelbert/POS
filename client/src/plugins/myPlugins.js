import { mapState, mapMutations } from "vuex"

const myPlugins = {
    install(Vue) {
        Vue.mixin({
            data: () => ({
                url: process.env.VUE_APP_URL,
                gSystemTitle: 'PAOER Groceries',
                gObjUserType: [
                    { id: 1, name: "Admin" },
                    { id: 2, name: "Cashier" }
                ],
                gObjType: [
                    { id: 0, name: "Not Yet Approved" },
                    { id: 1, name: "Admin" },
                    { id: 2, name: "Cashier" }
                ]
            }),
            computed: {
                ...mapState([
                    'sUserData',
                    'sSales_product',
                    'sMasterID',
                    'sReportID',
                    'sProductID',
                    'sBlnGraph',
                    'sIntHome'
                ]),

                cUserName() {
                    let UserName =
                        this.sUserData[0].Fname +
                        " " +
                        this.sUserData[0].Mname +
                        " " +
                        this.sUserData[0].Lname;
                    return UserName;
                },
                cUserType() {
                    let usersType = this.gObjUserType.filter(data => {
                        return data.id == this.sUserData[0].UserType;
                    });
                    return usersType[0].name;
                },

            },
            methods: {
                ...mapMutations([
                    'cUserData',
                    'cSales_product',
                    'cMasterID',
                    'cReportID',
                    'cProductID',
                    'cBlnGraph',
                    'cIntHome'
                ])
            }

        })
    }
}
export default myPlugins