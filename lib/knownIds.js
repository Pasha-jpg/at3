// lib/knownIds.js

export const KNOWN_IDS = {
  projects: [
    '01krwdyb16xrcwcqz400ngrbxa',
    '01krwdyb188czjfa7c2pktqehg',
    '01kvz0by1h4zg9nwngh3a9tqq4',
    '01m3c88edh1vws8330cxdmhfdv',
    '01m3c88edkwmnzc51vg3rej9pb',
  ],
  tasks: [
    '01krwdyb1acccffnrgcbf8wa4h',
    '01m3c88ednm9s4krj6g99ac779',
    '01m3c88edp4z22avsw92ektr4m',
    '01m3c88edrrgapgfrmcf5vwjfn',
    '01m3c88ee70q1wnhkxzhvkd5q2',
    '01m3c88eea767ff9hq4a9pk3xs',
    '01m3c88eec8xxqfa7s4d82k2b2',
  ],
  milestones: [
    '01krwdznr0dpdgkk81gs3mgr0j',
    '01m3c88rb4b70hf9g6jt64qkhq',
    '01m3c88rb5ycft53thf7fesqyx',
    '01m3c88rb7nhr6fx0bj5kzr222',
    '01m3c88rb95mq41vaqkce7c2an',
    '01m3c88rbaxq649240xqtpvfkn',
    '01m3c88rbcmf91zyt8xqsa150f',
    '01m5ckagfnj9451k20vha1p5cf',
  ],
  checklist: [
    '01krwdyb1f7azvn161egjftfh4',
    '01m3c88edt49qb49xsrzdc68gm',
    '01m3c88edv69d3nqeh3js2d584',
    '01m3c88edx2jzp54f3rc478abc',
    '01m3c88edy7qz21gbpatgf1rmk',
    '01m3c88ee18y6aq91dxj47w16g',

  ],
  comments: [
    '01m3c88vjx3vammvjfttxncy82',
    '01krwdzpbv8xz4v9qbaakjwdb4',
    '01m3c88vn1r6nr1qb7yyxa21c3',
    '01m3c88vn2kvygywsw2w9v68rz',
    '01m3c88vjx3vammvjfttxncy82', 
    '01m3c88vk01d7ek81hecdcgyzr', 
    '01m3c88vk2b9peyc08yk7thxc6', 
    '01m3c88vk45t0bwqgtpr4azype', 
    '01m3c88vk668hkw6c1vv1c8q00', 
    '01m3c88vk76z44541z7nyysbhh', 
    '01m3c88vk9hv9bzekad6ca11j6', 
    '01m3c88vka6dz9z18we73pwcfa',
    '01m3c88vkc94g0cxb2d23dgap9', 
    '01m3c88vkerypqckgrsvkxc1dy', 
    '01m3c88vkfj6g1cbbmdrc8t5ns', 
    '01m3c88vkhb01e97e1z0nk333m',
    '01m3c88vkk7p52dtchcgmyn9x3', 
    '01m3c88vkmv2y530tdqjpft8qb', 
    '01m3c88vkqnxsjhhag5d860ffg', 
    '01m3c88vksxy1bcht8y8gg2zym',
    '01m3c88vktje9qtyrrx7cxvtez', 
    '01m3c88vkw5t4yhfs41p7zprwa', 
    '01m3c88vkzf5q33v704gd97ey1', 
    '01m3c88vm0qrchvbz8azd1shtd', 
   '01m3c88vn7m8qqm9qxhdskhh1p',
   '01m3c88vn9x7akk27saxcr85zh', 
   '01m3c88vnaw73hjps77546zjy6', 
   '01m3c88vnca9aywyhm17a6nevh', 
   '01m3c88vnepdrjwyzkh6wggrz4',
   '01m3c88vnfvns7ks7tgfz71m75', 
   '01m3c88vnh3vadnmrpetwgzvkm',
   '01m3c88vnjkxpffb7636se0mmw', 
  ],
};

export function generateParams(ids) {
  if (!ids || ids.length === 0) {
    return [{ id: '1' }];
  }
  // ✅ Pro-tip: using a Set removes any accidental duplicates automatically!
  return [...new Set(ids)].map(id => ({ id }));
}