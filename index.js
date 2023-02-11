import { productModal } from "./userProductModal.js";
const api = "https://vue3-course-api.hexschool.io/v2";
const path = "j437437";

Object.keys(VeeValidateRules).forEach((rule) => {
  if (rule !== "default") {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});
// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL("./zh_TW.json");
// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize("zh_TW"),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

const app = Vue.createApp({
  data() {
    return {
      products: [],
      productId: "",
      cart: {
        carts: {},
      },
      loadingItem: "", //存id
      form: {
        user: {
          name: "",
          email: "",
          tel: "",
          address: "",
        },
        message: "",
      },
    };
  },
  // components: {},
  methods: {
    getProducts() {
      const url = `${api}/api/${path}/products`;
      axios
        .get(url)
        .then((res) => {
          this.products = res.data.products;
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    openModal(id) {
      this.productId = id;
      this.loadingItem = id;
      setTimeout(() => {
        this.loadingItem = "";
      }, 1000);
    },
    addToCart(product_id, qty = 1) {
      // 參數預設值 qty = 1
      const data = {
        product_id,
        qty,
      };
      const url = `${api}/api/${path}/cart`;
      this.loadingItem = product_id;
      axios.post(url, { data }).then((res) => {
        this.$refs.productModal.hide();
        this.getCarts();
        this.loadingItem = "";
        alert("已加入購物車");
      });
    },
    getCarts() {
      const url = `${api}/api/${path}/cart`;
      axios
        .get(url)
        .then((res) => {
          this.cart = res.data.data;
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    updateCartItem(item) {
      //有分 購物車的id 和 產品的id
      const url = `${api}/api/${path}/cart/${item.id}`;
      const data = {
        product_id: item.product.id,
        qty: item.qty,
      };
      this.loadingItem = item.id; //避免用戶在還沒更新完成就重複按
      axios
        .put(url, { data })
        .then((res) => {
          this.getCarts();
          this.loadingItem = ""; //axios完成後清空
          alert("數量更改成功");
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    deleteCartItem(item) {
      const url = `${api}/api/${path}/cart/${item.id}`;
      this.loadingItem = item.id;
      axios
        .delete(url)
        .then((res) => {
          console.log("刪除購物車:", res.data.message);
          this.getCarts();
          this.loadingItem = "";
          alert("刪除成功");
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    deleteAllCart() {
      const url = `${api}/api/${path}/carts`;
      axios
        .delete(url)
        .then((res) => {
          alert(res.data.message);
          this.getCarts();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    isPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/;
      return phoneNumber.test(value) ? true : "請輸入正確的手機號碼";
    },
    createOrder() {
      const url = `${api}/api/${path}/order`;
      const data = this.form;
      axios
        .post(url, { data })
        .then((res) => {
          alert(res.data.message);
          this.$refs.form.resetForm();
          this.getCarts();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
  },
  components: {
    productModal,
  },
  mounted() {
    this.getProducts();
    this.getCarts();
  },
});
app.component("loading", VueLoading.Component);
app.component("VForm", VeeValidate.Form);
app.component("VField", VeeValidate.Field);
app.component("ErrorMessage", VeeValidate.ErrorMessage);

app.mount("#app");
