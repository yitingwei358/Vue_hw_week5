export const productModal = {
  //當 id 變動時，取得遠端資料並呈現 model
  props: ["id", "addToCart", "openModal"],
  data() {
    return {
      api: "https://vue3-course-api.hexschool.io/v2",
      path: "j437437",
      modal: {},
      tempProduct: {},
      qty: 1,
    };
  },
  template: "#userProductModal",
  watch: {
    id() {
      const url = `${this.api}/api/${this.path}/product/${this.id}`;
      //避免id為空值時，造成取得遠端資料錯誤
      if (this.id) {
        axios
          .get(url)
          .then((res) => {
            this.tempProduct = res.data.product;
            this.modal.show();
          })
          .catch((err) => {
            alert(err);
          });
      }
    },
  },
  methods: {
    hide() {
      this.modal.hide();
    },
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal);
    // this.modal.show();
    // 解決 watch 產生的問題 -> id 沒變時無法再次該起同產品的Modal
    // 監聽 DOM，當 Modal 關閉時，清掉 id
    this.$refs.modal.addEventListener("hidden.bs.modal", (event) => {
      // this.id = "";  不能這樣寫，因為不能由內層改 id
      this.openModal("");
    });
  },
};
