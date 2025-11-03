// Fix: Provide concrete definitions for SPEAKING_TOPICS and CRITERIA.
// Using 'as const' helps TypeScript infer more specific types, which resolves
// type errors in components that consume these constants.

export const SPEAKING_TOPICS = {
  en: {
    "General Speaking Topics (CEFR)": [
      "Freestyle (Talk about any topic you want)",
      "Introduce yourself and your family.",
      "Describe your favorite holiday memory.",
      "Talk about your dream job.",
      "If you had a superpower, what would it be and why?",
      "Summarize the last book you read or movie you watched.",
      "What are the advantages and disadvantages of the city you live in?",
      "Discuss the effects of technology on daily life.",
      "Describe an unforgettable childhood memory.",
      "Is there a new hobby or skill you want to learn? What is it and why?",
      "Where do you see yourself in the next 10 years?",
      "Introduce your country and its visitors. (Capital, people, language, celebrations, etc.)",
      "Introduce yourself, your new school, and your new friends.",
      "Introduce yourself and school life in Turkey.",
      "Talk about the national holidays and a tourist attraction in your country.",
      "Describe your daily and study routine.",
      "Compare your daily routine with a friend's.",
      "Talk about a person you admire. Describe their appearance and personality.",
      "Introduce your family members and their professions.",
      "Describe your home and your neighborhood.",
      "Talk about what you enjoy doing at home.",
      "Talk about living in the city and in the countryside.",
      "Talk about a local food or a festival in your city.",
      "Choose an endangered animal and describe its habitat.",
      "Explain how we can protect endangered animals.",
      "Talk about your favorite movie about the future.",
      "Describe what kind of technologies people might use in the year 2050.",
      "Prepare a short speech titled \"Me and My World\" that combines all themes."
    ],
    "IELTS Speaking Topics": [
      "Talk about your city. Where is it? What kind of place is it?",
      "Talk about your education. What are you studying? Why did you choose this major?",
      "Describe a website where you bought something. What did you buy, why did you buy it, and were you satisfied?",
      "What are the advantages and disadvantages of online shopping?",
      "Describe a person in your family you admire. Who are they, what are they like, and why do you admire them?",
      "Is it better to have a few close friends or many friends?",
      "Describe an interesting journey you've taken.",
      "How has technology changed the way people communicate?"
    ],
    "TOEFL Speaking Topics": [
      "\"It is more important for a city to have beautiful design than to be functional.\" Do you agree or disagree, and why?",
      "Some people prefer to work for a company, while others prefer to have their own business. Which do you prefer, and why?",
      "Should schools require students to wear uniforms? Why or why not?",
      "Is it more important to learn about the past, or to focus on the present and the future? Why?"
    ]
  },
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
      "Ülkeni ve ziyaretçilerini tanıt. (Başkent, insanlar, dil, kutlamalar vb.)",
      "Kendini, yeni okulunu ve yeni arkadaşlarını tanıt.",
      "Kendini ve Türkiye'deki okul hayatını tanıt.",
      "Ülkendeki milli bayramlardan ve turistik bir yerden bahset.",
      "Günlük ve ders çalışma rutinini anlat.",
      "Kendi günlük rutinini bir arkadaşınınkiyle karşılaştır.",
      "Hayranlık duyduğun bir kişiden bahset. Dış görünüşünü ve kişiliğini tarif et.",
      "Aile üyelerini ve mesleklerini tanıt.",
      "Evini ve mahallenizi tarif et.",
      "Evde ne yapmaktan hoşlandığından bahset.",
      "Şehirde ve kırsalda yaşamaktan bahset.",
      "Şehrindeki yerel bir yiyecekten veya bir festivalden bahset.",
      "Nesli tükenmekte olan bir hayvan seç ve yaşam alanını tarif et.",
      "Nesli tükenmekte olan hayvanları nasıl koruyabileceğimizi açıkla.",
      "Gelecekle ilgili en sevdiğin filmden bahset.",
      "2050 yılında insanların ne tür teknolojiler kullanabileceğini anlat.",
      "Tüm temaları birleştiren \"Ben ve Dünyam\" başlıklı kısa bir konuşma hazırla."
    ],
    "IELTS Konuşma Konuları": [
      "Şehrinden bahset. Nerede? Nasıl bir yer?",
      "Eğitiminden bahset. Ne okuyorsun? Neden bu bölümü seçtin?",
      "Bir şey satın aldığın bir web sitesini tanımla. Ne satın aldın, neden aldın, memnun kaldın mı?",
      "Online alışverişin avantajları ve dezavantajları nelerdir?",
      "Ailende hayranlık duyduğun bir kişiyi tanımla. Kimdir, nasıldır, neden hayranlık duyuyorsun?",
      "Az sayıda yakın arkadaş mı, çok sayıda arkadaş mı daha iyidir?",
      "İlginç bir yolculuğunu anlat.",
      "Teknoloji insanların iletişim biçimini nasıl değiştirdi?"
    ],
    "TOEFL Konuşma Konuları": [
      "“Bir şehrin güzel tasarıma sahip olması, işlevsel olmasından daha önemlidir.” Katılıyor musun, neden?",
      "Bazı insanlar bir şirkette çalışmayı, bazıları ise kendi işini yapmayı tercih eder. Sen hangisini tercih edersin, neden?",
      "Okullar öğrencilerin üniforma giymesini zorunlu tutmalı mı? Neden?",
      "Geçmiş hakkında bilgi edinmek mi, yoksa bugüne ve geleceğe odaklanmak mı daha önemlidir? Neden?"
    ]
  }
} as const;

export const CRITERIA = {
  en: [
    { key: 'rapport' },
    { key: 'organisation' },
    { key: 'delivery' },
    { key: 'languageUse' },
    { key: 'creativity' },
  ],
  tr: [
    { key: 'rapport' },
    { key: 'organisation' },
    { key: 'delivery' },
    { key: 'languageUse' },
    { key: 'creativity' },
  ],
} as const;