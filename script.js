// GANTI nomor ini dengan WhatsApp bisnis: kode negara 62, tanpa +, spasi, atau strip.
const WHATSAPP_NUMBER = "6281234567890";
const productSelect = document.getElementById("product");
const quantityInput = document.getElementById("quantity");
const totalOutput = document.getElementById("total");
const formMessage = document.getElementById("formMessage");
let customChoice = null;

function rupiah(value) {
  if (!value) return "Dikonfirmasi admin";
  return new Intl.NumberFormat("id-ID", {style:"currency",currency:"IDR",maximumFractionDigits:0}).format(value);
}
function selectedPrice() { return Number(productSelect.selectedOptions[0].dataset.price || 0); }
function updateTotal() {
  const qty = Math.max(1, Math.min(99, Number(quantityInput.value) || 1));
  quantityInput.value = qty;
  const price = selectedPrice();
  totalOutput.textContent = price ? rupiah(price * qty) : "Dikonfirmasi admin";
}
productSelect.addEventListener("change", updateTotal);
quantityInput.addEventListener("input", updateTotal);
document.getElementById("minus").addEventListener("click", () => {quantityInput.value = Math.max(1, Number(quantityInput.value || 1)-1);updateTotal();});
document.getElementById("plus").addEventListener("click", () => {quantityInput.value = Math.min(99, Number(quantityInput.value || 1)+1);updateTotal();});

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    document.querySelectorAll(".product-card").forEach(card => {
      card.hidden = button.dataset.filter !== "all" && card.dataset.shape !== button.dataset.filter;
    });
  });
});
document.querySelectorAll(".add-button").forEach(button => {
  button.addEventListener("click", () => {
    productSelect.value = button.dataset.product;
    document.getElementById("orderShape").value = button.closest(".product-card").dataset.shape;
    document.getElementById("orderColor").value = button.closest(".product-card").dataset.color;
    document.getElementById("orderDesign").value = button.closest(".product-card").dataset.design;
    customChoice = null;
    updateTotal();
    document.getElementById("pesanan").scrollIntoView({behavior:"smooth"});
  });
});
document.getElementById("applyCustom").addEventListener("click", () => {
  const shape = document.querySelector('input[name="shape"]:checked').value;
  const color = document.getElementById("customColor").value;
  const design = document.getElementById("customDesign").value;
  const logo = document.getElementById("customText").value.trim();
  customChoice = {shape,color,design,logo};
  productSelect.value = "Topi custom";
  document.getElementById("orderShape").value = shape;
  document.getElementById("orderColor").value = color;
  document.getElementById("orderDesign").value = design;
  document.getElementById("notes").value = `Permintaan custom — Warna: ${color}; Desain: ${design}; Tulisan/logo: ${logo || "belum ditentukan"}`;
  updateTotal();
  document.getElementById("customMessage").textContent = "Pilihan custom diterapkan ke formulir pesanan.";
  document.getElementById("pesanan").scrollIntoView({behavior:"smooth"});
});
document.getElementById("orderForm").addEventListener("submit", event => {
  event.preventDefault();
  const name = document.getElementById("customer").value.trim();
  if (!name) { formMessage.textContent = "Isi nama pemesan terlebih dahulu."; return; }
  if (WHATSAPP_NUMBER === "6281234567890") {
    formMessage.textContent = "Demo: ganti nomor WhatsApp bisnis di script.js sebelum digunakan.";
    return;
  }
  const qty = Math.max(1, Number(quantityInput.value) || 1);
  const price = selectedPrice();
  const msg = [
    "Halo, saya ingin memesan topi.",
    "", `Nama: ${name}`, `Produk: ${productSelect.value}`,
    `Bentuk: ${document.getElementById("orderShape").value}`,
    `Warna: ${document.getElementById("orderColor").value}`,
    `Desain: ${document.getElementById("orderDesign").value}`,
    `Jumlah: ${qty}`, `Estimasi total: ${price ? rupiah(price*qty) : "Mohon konfirmasi harga custom"}`,
    `Catatan: ${document.getElementById("notes").value.trim() || "-"}`,
    "", "Mohon konfirmasi ketersediaan dan ongkir. Terima kasih!"
  ].join("\\n");
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  formMessage.textContent = "Pesanan siap dikirim melalui WhatsApp.";
});
document.getElementById("year").textContent = new Date().getFullYear();
updateTotal();
