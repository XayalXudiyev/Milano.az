export type FaqGroup = "order" | "delivery" | "products" | "discounts";
export type Faq = { q: string; a: string; group: FaqGroup };

export const FAQ: Faq[] = [
  {
    group: "order",
    q: "Sifarişi necə verə bilərəm?",
    a: "Bəyəndiyiniz məhsulları səbətə əlavə edin və «WhatsApp ilə sifariş et» düyməsinə basın — siyahı hazır mesaj şəklində bizə göndəriləcək. İstəsəniz 055 426 24 39 nömrəsinə zəng edərək də sifariş verə bilərsiniz.",
  },
  {
    group: "products",
    q: "Məhsullar orijinaldırmı?",
    a: "Bəli. Nouvelle, Redist, RedOne və Razorline məhsulları rəsmi tədarükçülərdən gəlir, hər birinin seriya nömrəsi və istehsal tarixi var. Saxta və ya müddəti keçmiş məhsul satmırıq.",
  },
  {
    group: "delivery",
    q: "Çatdırılma necə həyata keçirilir və nə qədər çəkir?",
    a: "Çatdırılma pulsuzdur. Bu gün verilən sifariş 2 gün ərzində — sabah və ya ertəsi gün çatdırılır. Regionlara da poçt və kargo vasitəsilə çatdırılma var.",
  },
  {
    group: "delivery",
    q: "Hansı ödəniş üsulları var?",
    a: "Nağd (qapıda), bank kartı ilə və köçürmə ilə ödəniş qəbul edirik. Diqqət: qayçılar, ülgüc və ütü üzrə endirimlər yalnız nağd ödənişdə keçərlidir.",
  },
  {
    group: "discounts",
    q: "Endirimlər müvəqqətidirmi?",
    a: "Xeyr, endirimlər daimidir — müddət məhdudiyyəti yoxdur. Razorline qayçılarında 40%, Artego ütüsündə 33% (yalnız nağd), Redist və RedOne məhsullarında 20%, Fresh Feel məhsullarında 15% endirim var. Yeni kampaniyaları Instagram səhifəmizdə elan edirik.",
  },
  {
    group: "products",
    q: "Solaxaylar üçün qayçınız varmı?",
    a: "Bəli — Razorline AK23L modeli solaxay ustalar üçün xüsusi hazırlanıb. Bütün Razorline qayçıları paslanmaz Yapon poladındandır.",
  },
  {
    group: "products",
    q: "Hansı wax mənim saçım üçün uyğundur?",
    a: "Parlaq, «yaş» görünüş üçün Aqua wax-lar (Red, Blue, Cobra, Olive və s.), təbii mat görünüş üçün Matte seriyası (Green, Argan, Keratin, Matte White/Black), tekstura və yaradıcı tərzlər üçün Creative Fiber və ya Spider wax seçin.",
  },
];
