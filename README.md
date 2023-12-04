# Aliexpress Product Scraper

[![Build Status](https://api.travis-ci.org/sudheer-ranga/aliexpress-product-scraper.svg?branch=master)](https://travis-ci.org/sudheer-ranga/aliexpress-product-scraper)

Aliexpress Product Scraper scrapes product information and returns the response in json format including:

- Description
- Reviews
- Variants and Prices
- Shipping Info

# How to use?

```
npm i aliexpress-product-scraper
```

```
import scrape from 'aliexpress-product-scraper';

scrape('1005005167379524', options).then(res => {
  console.log('Product JSON: ', res);
});
```

Initialiser takes id as a string. It also takes options which are optional. Options are defined as below.

`id` - Aliexpress Product ID

Options

```
{
  reviewsCount: 20,
  filterReviewsBy: 'all' | 1 | 2 | 3 | 4 | 5,
  puppeteerOptions: {},
}
```

1. `reviewsCount` - Defaults to 20 reviews.
2. `filterReviewsBy` - Fetches `all` reviews by default. Pass `1` `2` `3` `4` `5` to filter by specific reviews. Support only 1 rating at once.
3. `puppeteerOptions` - Any options that puppeteer supports.

# Sample JSON Response

```
{
  "title": "Belts Famous Brand Belt Men Mens Belts Quality Genuine Luxury Leather Belt For Men Belt Male Strap Male Metal Automatic Buckle",
  "categoryId": 200000298,
  "productId": 1005005167379524,
  "quantity": {
    "total": 2915,
    "available": 2915
  },
  "description": "<div class=\"detailmodule_image\"><span style=\"font-size:0px\">Belts Famous Brand Belt Men Mens belts Quality Genuine Luxury Leather belt for Men Belt male Strap Male Metal Automatic Buckle</span><img style=\"margin-bottom:10px\" class=\"detail-desc-decorate-image\" src=\"https://ae01.alicdn.com/kf/A67e7e00c22a34c03a2fd6abd8335ca94o.jpg\" slate-data-type=\"image\"><img style=\"margin-bottom:10px\" class=\"detail-desc-decorate-image\" src=\"https://ae01.alicdn.com/kf/A4eb2fb78352e4a75a5d5af99291bf3c0O.jpg\" slate-data-type=\"image\"><img style=\"margin-bottom:10px\" class=\"detail-desc-decorate-image\" src=\"https://ae01.alicdn.com/kf/A724b1b680ea144ec97177a675436afe0X.jpg\" slate-data-type=\"image\"><img style=\"margin-bottom:10px\" class=\"detail-desc-decorate-image\" src=\"https://ae01.alicdn.com/kf/A3a884f6c417443f294445df4caabe2d8g.jpg\" slate-data-type=\"image\"><img style=\"margin-bottom:10px\" class=\"detail-desc-decorate-image\" src=\"https://ae01.alicdn.com/kf/A66887b28887f4a9bb7cd413c87871e4b3.jpg\" slate-data-type=\"image\"><img style=\"margin-bottom:10px\" class=\"detail-desc-decorate-image\" src=\"https://ae01.alicdn.com/kf/A6953b334519346ea8a5e70b1bc7e4d30x.jpg\" slate-data-type=\"image\"><img style=\"margin-bottom:10px\" class=\"detail-desc-decorate-image\" src=\"https://ae01.alicdn.com/kf/A43c07db96f144772aab4b867348c5042K.jpg\" slate-data-type=\"image\"></div><div class=\"detailmodule_image\"><img style=\"margin-bottom:10px\" class=\"detail-desc-decorate-image\" src=\"https://ae01.alicdn.com/kf/A8a5a2cc0cbff47f19839818817af211df.jpg\" slate-data-type=\"image\"><img style=\"margin-bottom:10px\" class=\"detail-desc-decorate-image\" src=\"https://ae01.alicdn.com/kf/Abee28c446a5b4a5cb2e5e37597a0950eZ.jpg\" slate-data-type=\"image\"><img style=\"margin-bottom:10px\" class=\"detail-desc-decorate-image\" src=\"https://ae01.alicdn.com/kf/A092cc17e08c74e5d92658ebbb01cb1a6W.jpg\" slate-data-type=\"image\"><img style=\"margin-bottom:10px\" class=\"detail-desc-decorate-image\" src=\"https://ae01.alicdn.com/kf/A89f6efe8339944e1a6981a3660575c01l.jpg\" slate-data-type=\"image\"><img style=\"margin-bottom:10px\" class=\"detail-desc-decorate-image\" src=\"https://ae01.alicdn.com/kf/Aca2a75bbd4514c9ea128ebf6eedbf8f6K.jpg\" slate-data-type=\"image\"><img style=\"margin-bottom:10px\" class=\"detail-desc-decorate-image\" src=\"https://ae01.alicdn.com/kf/Aed711ad0c4e844c7ba50a37ba2a2f3cbt.jpg\" slate-data-type=\"image\"><img style=\"margin-bottom:10px\" class=\"detail-desc-decorate-image\" src=\"https://ae01.alicdn.com/kf/Ab5ba00118c274f1ebe3ad2a69b1c3ce8U.jpg\" slate-data-type=\"image\"><img style=\"margin-bottom:10px\" class=\"detail-desc-decorate-image\" src=\"https://ae01.alicdn.com/kf/A00ca9a7d4d0b4c8bb76f0554bc1d6d85x.jpg\" slate-data-type=\"image\"><img style=\"margin-bottom:10px\" class=\"detail-desc-decorate-image\" src=\"https://ae01.alicdn.com/kf/Aeac414ae848a4c6b8ca23c35651363a9Q.jpg\" slate-data-type=\"image\"></div><div class=\"detailmodule_image\"><img style=\"margin-bottom:10px\" class=\"detail-desc-decorate-image\" src=\"https://ae01.alicdn.com/kf/A3babd7dd86594ffa8ea7b913e561e003C.jpg\" slate-data-type=\"image\"><img style=\"margin-bottom:10px\" class=\"detail-desc-decorate-image\" src=\"https://ae01.alicdn.com/kf/A9f119a0b783746539e75d123e9aed02br.jpg\" slate-data-type=\"image\"><img style=\"margin-bottom:10px\" class=\"detail-desc-decorate-image\" src=\"https://ae01.alicdn.com/kf/A57418fd34de9439c99c81c36291b3c00P.jpg\" slate-data-type=\"image\"><img style=\"margin-bottom:10px\" class=\"detail-desc-decorate-image\" src=\"https://ae01.alicdn.com/kf/A54705ead34374411bd209b1da3683111p.jpg\" slate-data-type=\"image\"><img style=\"margin-bottom:10px\" class=\"detail-desc-decorate-image\" src=\"https://ae01.alicdn.com/kf/Aebecf8b1b81d47e3b0e95935211b65a56.jpg\" slate-data-type=\"image\"><img style=\"margin-bottom:10px\" class=\"detail-desc-decorate-image\" src=\"https://ae01.alicdn.com/kf/Acd3c6355f8dd443ca4ce764072497b95A.jpg\" slate-data-type=\"image\"><img style=\"margin-bottom:10px\" class=\"detail-desc-decorate-image\" src=\"https://ae01.alicdn.com/kf/A41516c4213b2410db8f0e7326ebe0bb27.jpg\" slate-data-type=\"image\"><img style=\"margin-bottom:10px\" class=\"detail-desc-decorate-image\" src=\"https://ae01.alicdn.com/kf/A6dbe49a93a5843049fd6bfa90868b6c0b.jpg\" slate-data-type=\"image\"><img style=\"margin-bottom:10px\" class=\"detail-desc-decorate-image\" src=\"https://ae01.alicdn.com/kf/A6fac50b7b99c487890eddb1b55862009z.jpg\" slate-data-type=\"image\"><img style=\"margin-bottom:10px\" class=\"detail-desc-decorate-image\" src=\"https://ae01.alicdn.com/kf/Ae37039e03add42e691707f66bcf42137m.jpg\" slate-data-type=\"image\"></div><div class=\"detailmodule_image\"><img class=\"detail-desc-decorate-image\" src=\"https://ae01.alicdn.com/kf/Aa8adab71a10a4d27ab4c6826970d0319L.jpg\" slate-data-type=\"image\"><img class=\"detail-desc-decorate-image\" src=\"https://ae01.alicdn.com/kf/Ade85a37af1dd41b8b58061d37ccfb2e4c.jpg\" slate-data-type=\"image\"><img class=\"detail-desc-decorate-image\" src=\"https://ae01.alicdn.com/kf/A7af7c1061767464081a8d458c9755b8aj.jpg\" slate-data-type=\"image\"></div><p><br></p>\n<script>window.adminAccountId=2673771248;</script>\n",
  "orders": "5,000+",
  "storeInfo": {
    "name": "SaengQ Belt Store",
    "logo": "https://ae01.alicdn.com/kf/S7f770946de0d4e8c80e7d06d15f6009d7.png",
    "companyId": 2673771248,
    "storeNumber": 1102598020,
    "isTopRated": false,
    "hasPayPalAccount": false,
    "ratingCount": 5267,
    "rating": "96.1"
  },
  "ratings": {
    "totalStar": 5,
    "averageStar": "4.7",
    "totalStartCount": 1664,
    "fiveStarCount": 1358,
    "fourStarCount": 221,
    "threeStarCount": 42,
    "twoStarCount": 15,
    "oneStarCount": 28
  },
  "images": [
    "https://ae01.alicdn.com/kf/S06fcac1cfaeb467b94a00e5fadcceebb3/Belts-Famous-Brand-Belt-Men-Mens-Belts-Quality-Genuine-Luxury-Leather-Belt-For-Men-Belt-Male.jpg",
    "https://ae01.alicdn.com/kf/Sbf8be40921594b3d9143e504403386c6I/Belts-Famous-Brand-Belt-Men-Mens-Belts-Quality-Genuine-Luxury-Leather-Belt-For-Men-Belt-Male.jpg",
    "https://ae01.alicdn.com/kf/S98ab69e7fab24e6487df043a14e094eel/Belts-Famous-Brand-Belt-Men-Mens-Belts-Quality-Genuine-Luxury-Leather-Belt-For-Men-Belt-Male.jpg",
    "https://ae01.alicdn.com/kf/S7da80d421c2047aab0f642ea76b435a5U/Belts-Famous-Brand-Belt-Men-Mens-Belts-Quality-Genuine-Luxury-Leather-Belt-For-Men-Belt-Male.jpg",
    "https://ae01.alicdn.com/kf/Sc40414c08e6f449a8e55a17f2e8700efs/Belts-Famous-Brand-Belt-Men-Mens-Belts-Quality-Genuine-Luxury-Leather-Belt-For-Men-Belt-Male.jpg",
    "https://ae01.alicdn.com/kf/S7d6212feb2bd403a908e1b2b128f562bD/Belts-Famous-Brand-Belt-Men-Mens-Belts-Quality-Genuine-Luxury-Leather-Belt-For-Men-Belt-Male.jpg"
  ],
  "reviews": [
    {
      "anonymous": false,
      "name": "o***o",
      "displayName": "Anna Collier",
      "gender": "female",
      "country": "FR",
      "rating": 2,
      "info": "Color:NE309 Belt Length:115CM ",
      "date": "06 Nov 2023",
      "content": "la boucle s'est détachée seule au bout de quelques semaines d'utilisation, logique puisque celle-ci n'est retenue que par deux petits clous de mediocre qualité.",
      "photos": [
        "https://ae01.alicdn.com/kf/Aeafa83229d3447dcaae2060bdfcf92bdM.jpg",
        "https://ae01.alicdn.com/kf/A4976cf60c06d4033b37aee6bbac673efp.jpg",
        "https://ae01.alicdn.com/kf/A7082aa4dbdf74ef6a879161d576d4243w.jpg",
        "https://ae01.alicdn.com/kf/Ab0b320321ed845c3a56156c436b7a7fe5.jpg"
      ],
      "thumbnails": [
        "https://ae01.alicdn.com/kf/Aeafa83229d3447dcaae2060bdfcf92bdM.jpg_220x220.jpg",
        "https://ae01.alicdn.com/kf/A4976cf60c06d4033b37aee6bbac673efp.jpg_220x220.jpg",
        "https://ae01.alicdn.com/kf/A7082aa4dbdf74ef6a879161d576d4243w.jpg_220x220.jpg",
        "https://ae01.alicdn.com/kf/Ab0b320321ed845c3a56156c436b7a7fe5.jpg_220x220.jpg"
      ]
    },
    {
      "anonymous": true,
      "name": "AliExpress Shopper",
      "displayName": "Christy Willms",
      "gender": "female",
      "country": "NG",
      "rating": 2,
      "info": "Color:NE304 silvery Belt Length:115CM ",
      "date": "17 Oct 2023",
      "content": "I received my belt shattered, so sad about it ",
      "photos": [
        "https://ae01.alicdn.com/kf/A8ef4ca261ec54a748e828447a2aaab13K.jpg",
        "https://ae01.alicdn.com/kf/A34003a19cf4249b58f80f7c380497355d.jpg",
        "https://ae01.alicdn.com/kf/Af3ad1dfcf3184128a212ec1a324c324fv.jpg"
      ],
      "thumbnails": [
        "https://ae01.alicdn.com/kf/A8ef4ca261ec54a748e828447a2aaab13K.jpg_220x220.jpg",
        "https://ae01.alicdn.com/kf/A34003a19cf4249b58f80f7c380497355d.jpg_220x220.jpg",
        "https://ae01.alicdn.com/kf/Af3ad1dfcf3184128a212ec1a324c324fv.jpg_220x220.jpg"
      ]
    },
    {
      "anonymous": false,
      "name": "s***r",
      "displayName": "Helen VonRueden",
      "gender": "female",
      "country": "KR",
      "rating": 2,
      "info": "Color:NE305 silvery Belt Length:115CM ",
      "date": "18 Nov 2023",
      "content": "버클 검정부분이 떠서 본드로 붙여서 사용해야되나?싶음",
      "photos": [
        "https://ae01.alicdn.com/kf/Aeb23160bc4b646dd8bea7332c0c4294bn.jpg",
        "https://ae01.alicdn.com/kf/A9ad776ee8955410a9f4053c6b7ed4f2f9.jpg"
      ],
      "thumbnails": [
        "https://ae01.alicdn.com/kf/Aeb23160bc4b646dd8bea7332c0c4294bn.jpg_220x220.jpg",
        "https://ae01.alicdn.com/kf/A9ad776ee8955410a9f4053c6b7ed4f2f9.jpg_220x220.jpg"
      ]
    },
    {
      "anonymous": false,
      "name": "L***D",
      "displayName": "Dr. Lewis Baumbach",
      "gender": "male",
      "country": "KR",
      "rating": 2,
      "info": "Color:NE701 Belt Length:120cm ",
      "date": "02 Dec 2023",
      "content": "절대",
      "photos": [],
      "thumbnails": []
    },
    {
      "anonymous": false,
      "name": "J***m",
      "displayName": "Carroll Stokes",
      "gender": "male",
      "country": "NL",
      "rating": 2,
      "info": "Color:NE701 Belt Length:115CM ",
      "date": "04 Jul 2023",
      "content": "De riem ziet er leuk uit maar is geen leer",
      "photos": [],
      "thumbnails": []
    },
    {
      "anonymous": false,
      "name": "r***r",
      "displayName": "Jennie Prohaska",
      "gender": "female",
      "country": "US",
      "rating": 2,
      "info": "Color:NE304-golden Belt Length:130cm ",
      "date": "09 Oct 2023",
      "content": "the belt couldn't stay in place as there's nothing to hold it. It's deem unusable",
      "photos": [],
      "thumbnails": []
    },
    {
      "anonymous": false,
      "name": "K***i",
      "displayName": "Malcolm Davis I",
      "gender": "male",
      "country": "NO",
      "rating": 2,
      "info": "Color:NE309 Belt Length:115CM ",
      "date": "08 Nov 2023",
      "content": "سيؤون",
      "photos": [],
      "thumbnails": []
    },
    {
      "anonymous": false,
      "name": "M***d",
      "displayName": "Sonia Hayes",
      "gender": "female",
      "country": "NO",
      "rating": 2,
      "info": "Color:NE305 silvery Belt Length:130cm ",
      "date": "22 Aug 2023",
      "content": "انا مااستلمت الحزام ارجو منكم الرد وشكرا",
      "photos": [],
      "thumbnails": []
    },
    {
      "anonymous": false,
      "name": "d***r",
      "displayName": "Mrs. Juanita Pagac",
      "gender": "female",
      "country": "KR",
      "rating": 2,
      "info": "Color:NE305 silvery Belt Length:120cm ",
      "date": "27 Nov 2023",
      "content": "그런대로 만족합니다.",
      "photos": [],
      "thumbnails": []
    },
    {
      "anonymous": false,
      "name": "a***a",
      "displayName": "Belinda Murphy",
      "gender": "female",
      "country": "CH",
      "rating": 2,
      "info": "Color:NE313 Belt Length:130cm ",
      "date": "26 Sep 2023",
      "content": "Trop grande",
      "photos": [],
      "thumbnails": []
    },
    {
      "anonymous": false,
      "name": "w***w",
      "displayName": "Darlene Breitenberg IV",
      "gender": "female",
      "country": "KR",
      "rating": 2,
      "info": "Color:NE701 Belt Length:120cm ",
      "date": "22 Nov 2023",
      "content": "아직",
      "photos": [],
      "thumbnails": []
    },
    {
      "anonymous": false,
      "name": "o***r",
      "displayName": "Beulah Paucek",
      "gender": "female",
      "country": "KR",
      "rating": 2,
      "info": "Color:NE304 silvery Belt Length:115CM ",
      "date": "25 Nov 2023",
      "content": "버클이 너무 큼",
      "photos": [],
      "thumbnails": []
    },
    {
      "anonymous": false,
      "name": "p***r",
      "displayName": "Kendra Davis",
      "gender": "female",
      "country": "KR",
      "rating": 2,
      "info": "Color:NE701 Belt Length:115CM ",
      "date": "15 Sep 2023",
      "content": "싸보이고, 크랙도 생김.",
      "photos": [],
      "thumbnails": []
    },
    {
      "anonymous": false,
      "name": "a***r",
      "displayName": "Nancy Bauch III",
      "gender": "female",
      "country": "KR",
      "rating": 2,
      "info": "Color:NE701 Belt Length:115CM ",
      "date": "28 Oct 2023",
      "content": "니들",
      "photos": [],
      "thumbnails": []
    },
    {
      "anonymous": false,
      "name": "a***a",
      "displayName": "Diana Mertz",
      "gender": "female",
      "country": "CH",
      "rating": 2,
      "info": "Color:NE305 silvery Belt Length:130cm ",
      "date": "26 Sep 2023",
      "content": "Trop grande",
      "photos": [],
      "thumbnails": []
    }
  ],
  "variants": {
    "options": [
      {
        "id": 14,
        "name": "Color",
        "values": [
          {
            "id": 29,
            "name": "WHITE",
            "displayName": "NE336-silvery",
            "image": "https://ae01.alicdn.com/kf/S0b481aeb168146c0bcfc80622a14c3a31/Belts-Famous-Brand-Belt-Men-Mens-Belts-Quality-Genuine-Luxury-Leather-Belt-For-Men-Belt-Male.jpg_640x640.jpg"
          },
          {
            "id": 193,
            "name": "black",
            "displayName": "NE305 silvery",
            "image": "https://ae01.alicdn.com/kf/Ac655ae1587c4440b9a60d141306a05abf/Belts-Famous-Brand-Belt-Men-Mens-Belts-Quality-Genuine-Luxury-Leather-Belt-For-Men-Belt-Male.jpg_640x640.jpg"
          },
          {
            "id": 175,
            "name": "green",
            "displayName": "NE337-silvery",
            "image": "https://ae01.alicdn.com/kf/Se0c05fa22eb54436a09351d28d8419b2p/Belts-Famous-Brand-Belt-Men-Mens-Belts-Quality-Genuine-Luxury-Leather-Belt-For-Men-Belt-Male.jpg_640x640.jpg"
          },
          {
            "id": 200004889,
            "name": "army green",
            "displayName": "NE309",
            "image": "https://ae01.alicdn.com/kf/S18f824ac8e1247f8b0090cd5b2fa0535w/Belts-Famous-Brand-Belt-Men-Mens-Belts-Quality-Genuine-Luxury-Leather-Belt-For-Men-Belt-Male.jpg_640x640.jpg"
          },
          {
            "id": 10,
            "name": "Red",
            "displayName": "NE320-silvery",
            "image": "https://ae01.alicdn.com/kf/Sa7dc406fc1bf45fb9fbf73b5a0186fe6A/Belts-Famous-Brand-Belt-Men-Mens-Belts-Quality-Genuine-Luxury-Leather-Belt-For-Men-Belt-Male.jpg_640x640.jpg"
          },
          {
            "id": 691,
            "name": "GRAY",
            "displayName": "NE320-golden",
            "image": "https://ae01.alicdn.com/kf/Se47677b8efdf43629cd018f0d403086bL/Belts-Famous-Brand-Belt-Men-Mens-Belts-Quality-Genuine-Luxury-Leather-Belt-For-Men-Belt-Male.jpg_640x640.jpg"
          },
          {
            "id": 200004890,
            "name": "Dark Grey",
            "displayName": "NE304 silvery",
            "image": "https://ae01.alicdn.com/kf/A605f8b3cf02a4234927e6f6e912ee64b9/Belts-Famous-Brand-Belt-Men-Mens-Belts-Quality-Genuine-Luxury-Leather-Belt-For-Men-Belt-Male.jpg_640x640.jpg"
          },
          {
            "id": 173,
            "name": "Blue",
            "displayName": "NE305-golden",
            "image": "https://ae01.alicdn.com/kf/S7f7f508360174324bf5c8d34a6c94e38H/Belts-Famous-Brand-Belt-Men-Mens-Belts-Quality-Genuine-Luxury-Leather-Belt-For-Men-Belt-Male.jpg_640x640.jpg"
          },
          {
            "id": 1254,
            "name": "SKY BLUE",
            "displayName": "NE304-golden",
            "image": "https://ae01.alicdn.com/kf/S48b952dd64734145a3b68f1980d3252e9/Belts-Famous-Brand-Belt-Men-Mens-Belts-Quality-Genuine-Luxury-Leather-Belt-For-Men-Belt-Male.jpg_640x640.jpg"
          },
          {
            "id": 366,
            "name": "Yellow",
            "displayName": "NE313",
            "image": "https://ae01.alicdn.com/kf/S00833d25435f4dc58646d42d6e2216cfU/Belts-Famous-Brand-Belt-Men-Mens-Belts-Quality-Genuine-Luxury-Leather-Belt-For-Men-Belt-Male.jpg_640x640.jpg"
          },
          {
            "id": 496,
            "name": "PURPLE",
            "displayName": "NE701",
            "image": "https://ae01.alicdn.com/kf/A881e74e49d4a466393de16a414955943n/Belts-Famous-Brand-Belt-Men-Mens-Belts-Quality-Genuine-Luxury-Leather-Belt-For-Men-Belt-Male.jpg_640x640.jpg"
          }
        ]
      },
      {
        "id": 200000858,
        "name": "Belt Length",
        "values": [
          {
            "id": 201447587,
            "name": "115CM",
            "displayName": "115CM"
          },
          {
            "id": 200006543,
            "name": "120cm",
            "displayName": "120cm"
          },
          {
            "id": 201447589,
            "name": "130cm",
            "displayName": "130cm"
          }
        ]
      }
    ],
    "prices": [
      {
        "skuId": 12000031946221040,
        "optionValueIds": "193,201447589",
        "availableQuantity": 169,
        "originalPrice": {
          "currency": "GBP",
          "formatedAmount": "￡16.44",
          "value": 16.44
        },
        "salePrice": {
          "currency": "GBP",
          "formatedAmount": "￡0.40",
          "value": 0.4
        }
      },
      {
        "skuId": 12000031946221038,
        "optionValueIds": "193,200006543",
        "availableQuantity": 180,
        "originalPrice": {
          "currency": "GBP",
          "formatedAmount": "￡16.08",
          "value": 16.08
        },
        "salePrice": {
          "currency": "GBP",
          "formatedAmount": "￡0.40",
          "value": 0.4
        }
      },
      {
        "skuId": 12000031946221036,
        "optionValueIds": "193,201447587",
        "availableQuantity": 274,
        "originalPrice": {
          "currency": "GBP",
          "formatedAmount": "￡16.21",
          "value": 16.21
        },
        "salePrice": {
          "currency": "GBP",
          "formatedAmount": "￡0.40",
          "value": 0.4
        }
      },
      {
        "skuId": 12000031946221036,
        "optionValueIds": "496,201447589",
        "availableQuantity": 96,
        "originalPrice": {
          "currency": "GBP",
          "formatedAmount": "￡15.89",
          "value": 15.89
        },
        "salePrice": {
          "currency": "GBP",
          "formatedAmount": "￡0.40",
          "value": 0.4
        }
      },
      {
        "skuId": 12000031946221036,
        "optionValueIds": "496,200006543",
        "availableQuantity": 101,
        "originalPrice": {
          "currency": "GBP",
          "formatedAmount": "￡15.49",
          "value": 15.49
        },
        "salePrice": {
          "currency": "GBP",
          "formatedAmount": "￡0.40",
          "value": 0.4
        }
      },
      {
        "skuId": 12000031946221034,
        "optionValueIds": "496,201447587",
        "availableQuantity": 279,
        "originalPrice": {
          "currency": "GBP",
          "formatedAmount": "￡14.99",
          "value": 14.99
        },
        "salePrice": {
          "currency": "GBP",
          "formatedAmount": "￡0.40",
          "value": 0.4
        }
      },
      {
        "skuId": 12000034561692826,
        "optionValueIds": "200004889,200006543",
        "availableQuantity": 56,
        "originalPrice": {
          "currency": "GBP",
          "formatedAmount": "￡15.53",
          "value": 15.53
        },
        "salePrice": {
          "currency": "GBP",
          "formatedAmount": "￡0.40",
          "value": 0.4
        }
      },
      {
        "skuId": 12000034561692828,
        "optionValueIds": "200004889,201447589",
        "availableQuantity": 77,
        "originalPrice": {
          "currency": "GBP",
          "formatedAmount": "￡16.30",
          "value": 16.3
        },
        "salePrice": {
          "currency": "GBP",
          "formatedAmount": "￡0.40",
          "value": 0.4
        }
      },
      {
        "skuId": 12000034561692824,
        "optionValueIds": "175,201447589",
        "availableQuantity": 87,
        "originalPrice": {
          "currency": "GBP",
          "formatedAmount": "￡16.30",
          "value": 16.3
        },
        "salePrice": {
          "currency": "GBP",
          "formatedAmount": "￡0.40",
          "value": 0.4
        }
      },
      {
        "skuId": 12000034561692824,
        "optionValueIds": "200004889,201447587",
        "availableQuantity": 43,
        "originalPrice": {
          "currency": "GBP",
          "formatedAmount": "￡15.53",
          "value": 15.53
        },
        "salePrice": {
          "currency": "GBP",
          "formatedAmount": "￡0.40",
          "value": 0.4
        }
      },
      {
        "skuId": 12000034561692830,
        "optionValueIds": "10,201447589",
        "availableQuantity": 28,
        "originalPrice": {
          "currency": "GBP",
          "formatedAmount": "￡16.26",
          "value": 16.26
        },
        "salePrice": {
          "currency": "GBP",
          "formatedAmount": "￡0.40",
          "value": 0.4
        }
      },
      {
        "skuId": 12000034561692832,
        "optionValueIds": "691,201447587",
        "availableQuantity": 15,
        "originalPrice": {
          "currency": "GBP",
          "formatedAmount": "￡15.76",
          "value": 15.76
        },
        "salePrice": {
          "currency": "GBP",
          "formatedAmount": "￡0.40",
          "value": 0.4
        }
      },
      {
        "skuId": 12000034561692828,
        "optionValueIds": "10,201447587",
        "availableQuantity": 66,
        "originalPrice": {
          "currency": "GBP",
          "formatedAmount": "￡16.12",
          "value": 16.12
        },
        "salePrice": {
          "currency": "GBP",
          "formatedAmount": "￡0.40",
          "value": 0.4
        }
      },
      {
        "skuId": 12000034561692828,
        "optionValueIds": "10,200006543",
        "availableQuantity": 77,
        "originalPrice": {
          "currency": "GBP",
          "formatedAmount": "￡16.26",
          "value": 16.26
        },
        "salePrice": {
          "currency": "GBP",
          "formatedAmount": "￡0.40",
          "value": 0.4
        }
      },
      {
        "skuId": 12000034561692820,
        "optionValueIds": "29,201447587",
        "availableQuantity": 55,
        "originalPrice": {
          "currency": "GBP",
          "formatedAmount": "￡16.30",
          "value": 16.3
        },
        "salePrice": {
          "currency": "GBP",
          "formatedAmount": "￡0.40",
          "value": 0.4
        }
      },
      {
        "skuId": 12000034561692822,
        "optionValueIds": "175,201447587",
        "availableQuantity": 66,
        "originalPrice": {
          "currency": "GBP",
          "formatedAmount": "￡16.03",
          "value": 16.03
        },
        "salePrice": {
          "currency": "GBP",
          "formatedAmount": "￡0.40",
          "value": 0.4
        }
      },
      {
        "skuId": 12000031946221042,
        "optionValueIds": "200004890,201447589",
        "availableQuantity": 154,
        "originalPrice": {
          "currency": "GBP",
          "formatedAmount": "￡16.17",
          "value": 16.17
        },
        "salePrice": {
          "currency": "GBP",
          "formatedAmount": "￡0.40",
          "value": 0.4
        }
      },
      {
        "skuId": 12000034561692824,
        "optionValueIds": "175,200006543",
        "availableQuantity": 72,
        "originalPrice": {
          "currency": "GBP",
          "formatedAmount": "￡16.62",
          "value": 16.62
        },
        "salePrice": {
          "currency": "GBP",
          "formatedAmount": "￡0.40",
          "value": 0.4
        }
      },
      {
        "skuId": 12000031946221040,
        "optionValueIds": "200004890,200006543",
        "availableQuantity": 56,
        "originalPrice": {
          "currency": "GBP",
          "formatedAmount": "￡17.85",
          "value": 17.85
        },
        "salePrice": {
          "currency": "GBP",
          "formatedAmount": "￡0.40",
          "value": 0.4
        }
      },
      {
        "skuId": 12000034561692820,
        "optionValueIds": "29,200006543",
        "availableQuantity": 44,
        "originalPrice": {
          "currency": "GBP",
          "formatedAmount": "￡16.44",
          "value": 16.44
        },
        "salePrice": {
          "currency": "GBP",
          "formatedAmount": "￡0.40",
          "value": 0.4
        }
      },
      {
        "skuId": 12000031946221040,
        "optionValueIds": "200004890,201447587",
        "availableQuantity": 222,
        "originalPrice": {
          "currency": "GBP",
          "formatedAmount": "￡15.85",
          "value": 15.85
        },
        "salePrice": {
          "currency": "GBP",
          "formatedAmount": "￡0.40",
          "value": 0.4
        }
      },
      {
        "skuId": 12000034561692820,
        "optionValueIds": "29,201447589",
        "availableQuantity": 81,
        "originalPrice": {
          "currency": "GBP",
          "formatedAmount": "￡16.44",
          "value": 16.44
        },
        "salePrice": {
          "currency": "GBP",
          "formatedAmount": "￡0.40",
          "value": 0.4
        }
      },
      {
        "skuId": 12000034561692842,
        "optionValueIds": "366,201447589",
        "availableQuantity": 49,
        "originalPrice": {
          "currency": "GBP",
          "formatedAmount": "￡15.53",
          "value": 15.53
        },
        "salePrice": {
          "currency": "GBP",
          "formatedAmount": "￡0.40",
          "value": 0.4
        }
      },
      {
        "skuId": 12000034561692840,
        "optionValueIds": "366,201447587",
        "availableQuantity": 98,
        "originalPrice": {
          "currency": "GBP",
          "formatedAmount": "￡15.53",
          "value": 15.53
        },
        "salePrice": {
          "currency": "GBP",
          "formatedAmount": "￡0.40",
          "value": 0.4
        }
      },
      {
        "skuId": 12000034561692840,
        "optionValueIds": "366,200006543",
        "availableQuantity": 112,
        "originalPrice": {
          "currency": "GBP",
          "formatedAmount": "￡15.85",
          "value": 15.85
        },
        "salePrice": {
          "currency": "GBP",
          "formatedAmount": "￡0.40",
          "value": 0.4
        }
      },
      {
        "skuId": 12000034561692834,
        "optionValueIds": "173,201447587",
        "availableQuantity": 54,
        "originalPrice": {
          "currency": "GBP",
          "formatedAmount": "￡16.62",
          "value": 16.62
        },
        "salePrice": {
          "currency": "GBP",
          "formatedAmount": "￡0.40",
          "value": 0.4
        }
      },
      {
        "skuId": 12000034561692836,
        "optionValueIds": "173,200006543",
        "availableQuantity": 71,
        "originalPrice": {
          "currency": "GBP",
          "formatedAmount": "￡16.03",
          "value": 16.03
        },
        "salePrice": {
          "currency": "GBP",
          "formatedAmount": "￡0.40",
          "value": 0.4
        }
      },
      {
        "skuId": 12000034561692832,
        "optionValueIds": "691,200006543",
        "availableQuantity": 57,
        "originalPrice": {
          "currency": "GBP",
          "formatedAmount": "￡16.08",
          "value": 16.08
        },
        "salePrice": {
          "currency": "GBP",
          "formatedAmount": "￡0.40",
          "value": 0.4
        }
      },
      {
        "skuId": 12000034561692832,
        "optionValueIds": "691,201447589",
        "availableQuantity": 53,
        "originalPrice": {
          "currency": "GBP",
          "formatedAmount": "￡16.30",
          "value": 16.3
        },
        "salePrice": {
          "currency": "GBP",
          "formatedAmount": "￡0.40",
          "value": 0.4
        }
      },
      {
        "skuId": 12000034561692838,
        "optionValueIds": "1254,200006543",
        "availableQuantity": 26,
        "originalPrice": {
          "currency": "GBP",
          "formatedAmount": "￡15.58",
          "value": 15.58
        },
        "salePrice": {
          "currency": "GBP",
          "formatedAmount": "￡0.40",
          "value": 0.4
        }
      },
      {
        "skuId": 12000034561692840,
        "optionValueIds": "1254,201447589",
        "availableQuantity": 26,
        "originalPrice": {
          "currency": "GBP",
          "formatedAmount": "￡16.58",
          "value": 16.58
        },
        "salePrice": {
          "currency": "GBP",
          "formatedAmount": "￡0.40",
          "value": 0.4
        }
      },
      {
        "skuId": 12000034561692836,
        "optionValueIds": "173,201447589",
        "availableQuantity": 59,
        "originalPrice": {
          "currency": "GBP",
          "formatedAmount": "￡16.30",
          "value": 16.3
        },
        "salePrice": {
          "currency": "GBP",
          "formatedAmount": "￡0.40",
          "value": 0.4
        }
      },
      {
        "skuId": 12000034561692836,
        "optionValueIds": "1254,201447587",
        "availableQuantity": 12,
        "originalPrice": {
          "currency": "GBP",
          "formatedAmount": "￡15.58",
          "value": 15.58
        },
        "salePrice": {
          "currency": "GBP",
          "formatedAmount": "￡0.40",
          "value": 0.4
        }
      }
    ]
  },
  "specs": [
    {
      "attrValue": "China (Mainland)",
      "attrName": "Place Of Origin"
    },
    {
      "attrValue": "3.5cm",
      "attrName": "Belt Width"
    },
    {
      "attrValue": "7cm",
      "attrName": "Buckle Length"
    },
    {
      "attrValue": "4cm",
      "attrName": "Buckle Width"
    },
    {
      "attrValue": "Plaid",
      "attrName": "Pattern Type"
    },
    {
      "attrValue": "Casual",
      "attrName": "Style"
    },
    {
      "attrValue": "Metal,Cowskin,Faux Leather",
      "attrName": "Belts Material"
    },
    {
      "attrValue": "Adult",
      "attrName": "Department Name"
    },
    {
      "attrValue": "MEN",
      "attrName": "Gender"
    },
    {
      "attrValue": "saengQ",
      "attrName": "Brand Name"
    },
    {
      "attrValue": "Mainland China",
      "attrName": "Origin"
    },
    {
      "attrValue": "Zhejiang",
      "attrName": "CN"
    },
    {
      "attrValue": "BELTS",
      "attrName": "Item Type"
    }
  ],
  "currencyInfo": {
    "baseCurrencyCode": "CNY",
    "enableTransaction": true,
    "currencySymbol": "￡",
    "symbolFront": false,
    "currencyRate": 0.1139,
    "baseSymbolFront": false,
    "currencyCode": "GBP",
    "baseCurrencySymbol": "CN￥",
    "multiCurrency": true
  },
  "originalPrice": {
    "min": {
      "currency": "GBP",
      "formatedAmount": "￡14.99",
      "value": 14.99
    },
    "max": {
      "currency": "GBP",
      "formatedAmount": "￡17.85",
      "value": 17.85
    }
  },
  "salePrice": {
    "min": {
      "currency": "GBP",
      "formatedAmount": "￡0.40",
      "value": 0.4
    },
    "max": {
      "currency": "GBP",
      "formatedAmount": "￡0.40",
      "value": 0.4
    }
  },
  "shipping": [
    {
      "deliveryProviderName": "Aliexpress Selection Premium shipping",
      "tracking": "invisible",
      "provider": "cainiao",
      "company": "Aliexpress Selection Premium shipping",
      "deliveryInfo": {
        "min": 5,
        "max": 5
      },
      "shippingInfo": {
        "from": "China",
        "fromCode": "CN",
        "to": "United Kingdom",
        "toCode": "UK",
        "fees": "￡1.61",
        "displayAmount": 1.61,
        "displayCurrency": "GBP"
      },
      "warehouseType": "own_warehouse"
    }
  ]
}
```
