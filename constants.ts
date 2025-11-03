export const SPEAKING_TOPICS = {
  tr: {
    "Genel Konuşma Konuları (CEFR)": [
      "Serbest Konuşma (İstediğiniz bir konu hakkında konuşun)",
      "Kendini ve aileni tanıt.",
      "En sevdiğin tatil anını anlat.",
      "Hayalindeki meslek hakkında konuş.",
      "Bir süper gücün olsaydı ne olurdu ve neden?",
      "En son okuduğun kitap veya izlediğin film hakkında bir özet yap.",
      "Yaşadığın şehrin avantajları ve dezavantajları nelerdir?",
      "Teknolojinin günlük yaşam üzerindeki etkilerini tartış.",
      "Unutamadığın bir çocukluk anını anlat.",
      "Öğrenmek istediğin yeni bir hobi veya yetenek var mı? Nedir ve neden?",
      "Gelecek 10 yıl içinde kendini nerede görüyorsun?",
    ],
    "IELTS Konuşma Konuları": [
      "Şehrinden bahset. Nerede? Nasıl bir yer?",
      "Eğitiminden bahset. Ne okuyorsun? Neden bu bölümü seçtin?",
      "Bir şey satın aldığın bir web sitesini tanımla. Ne satın aldın, neden aldın, memnun kaldın mı?",
      "Online alışverişin avantajları ve dezavantajları nelerdir?",
      "Ailende hayranlık duyduğun bir kişiyi tanımla. Kimdir, nasıldır, neden hayranlık duyuyorsun?",
      "Az sayıda yakın arkadaş mı, çok sayıda arkadaş mı daha iyidir?",
      "İlginç bir yolculuğunu anlat.",
      "Teknoloji insanların iletişim biçimini nasıl değiştirdi?",
    ],
    "TOEFL Konuşma Konuları": [
      "“Bir şehrin güzel tasarıma sahip olması, işlevsel olmasından daha önemlidir.” Katılıyor musun, neden?",
      "Bazı insanlar bir şirkette çalışmayı, bazıları ise kendi işini yapmayı tercih eder. Sen hangisini tercih edersin, neden?",
      "Okullar öğrencilerin üniforma giymesini zorunlu tutmalı mı? Neden?",
      "Geçmiş hakkında bilgi edinmek mi, yoksa bugüne ve geleceğe odaklanmak mı daha önemlidir? Neden?",
    ],
  },
  en: {
    "General Speaking Topics (CEFR)": [
      "Freestyle (Talk about any topic you want)",
      "Introduce yourself and your family.",
      "Describe your favorite holiday moment.",
      "Talk about your dream job.",
      "If you had a superpower, what would it be and why?",
      "Summarize the last book you read or movie you watched.",
      "What are the advantages and disadvantages of the city you live in?",
      "Discuss the impact of technology on daily life.",
      "Share an unforgettable childhood memory.",
      "Is there a new hobby or skill you want to learn? What is it and why?",
      "Where do you see yourself in the next 10 years?",
    ],
    "IELTS Speaking Topics": [
      "Talk about your hometown. Where is it? What is it like?",
      "Talk about your education. What are you studying? Why did you choose this major?",
      "Describe a website where you bought something. What did you buy, why did you buy it, and were you satisfied?",
      "What are the advantages and disadvantages of online shopping?",
      "Describe a person in your family you admire. Who are they, what are they like, and why do you admire them?",
      "Is it better to have a few close friends or many friends?",
      "Describe an interesting journey you have taken.",
      "How has technology changed the way people communicate?",
    ],
    "TOEFL Speaking Topics": [
      `"It is more important for a city to have a beautiful design than to be functional." Do you agree or disagree? Why?`,
      "Some people prefer to work for a company, while others prefer to be self-employed. Which one would you prefer and why?",
      "Should schools require students to wear uniforms? Why or why not?",
      "Is it more important to learn about the past or to focus on the present and future? Why?",
    ],
  },
};

export const CRITERIA = {
    tr: [
        { name: 'Bağ Kurma', key: 'rapport' as const, description: 'Dinleyici ile bağ kurma.' },
        { name: 'Organizasyon', key: 'organisation' as const, description: 'Düşünceleri mantıksal olarak yapılandırma.' },
        { name: 'Sunum', key: 'delivery' as const, description: 'Konuşmanın netliği, hızı ve tonu.' },
        { name: 'Dil Kullanımı', key: 'languageUse' as const, description: 'Kelime dağarcığı ve dilbilgisi doğruluğu.' },
        { name: 'Yaratıcılık', key: 'creativity' as const, description: 'Fikirlerin ve ifadenin özgünlüğü.' },
    ],
    en: [
        { name: 'Rapport', key: 'rapport' as const, description: 'Connecting with the listener.' },
        { name: 'Organisation', key: 'organisation' as const, description: 'Structuring your thoughts logically.' },
        { name: 'Delivery', key: 'delivery' as const, description: 'Clarity, pace, and tone of speech.' },
        { name: 'Language Use', key: 'languageUse' as const, description: 'Vocabulary and grammar accuracy.' },
        { name: 'Creativity', key: 'creativity' as const, description: 'Originality of ideas and expression.' },
    ]
};