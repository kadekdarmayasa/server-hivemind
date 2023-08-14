import { db } from '../lib/server.db';
import bcrypt from 'bcryptjs';

interface User {
  id: string;
  name: string;
  username: string;
  password: string;
  roleId: string;
  photo: string;
  publicPhoto?: string;
  email: string;
  linkedin: string;
}

interface Role {
  id: string;
  name: string;
}

interface Client {
  logo: string;
  name: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface Subscriber {
  email: string;
}

interface Testimony {
  clientName: string;
  clientPhoto: string;
  occupation: string;
  message: string;
  rate: number;
}

interface Portfolio {
  id: string;
  name: string;
  thumbnail: string;
  orientation: string;
  serviceId: string;
}

interface Blog {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  content: string;
  thumbnail: string;
  published: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
}

async function getUsers(): Promise<User[]> {
  return [
    {
      id: 'd678a1-19aa-1234-ee48-99a93726487b',
      name: 'Admin Hivemind',
      username: 'admin',
      password: 'Admin123',
      roleId: '5d809598-f83a-4138-a8dd-29a937264876',
      photo: 'default-profile.png',
      linkedin: 'admin',
      email: 'admin@gmail.com',
    },
    {
      id: 'd678a1-19aa-1234-ee48-99a93726487c',
      name: 'Amanda Chen',
      username: 'amandachen',
      password: 'Amandachen1',
      roleId: 'faa7c49d-7a48-431b-bf29-500d8df65351',
      photo: 'default-profile.png',
      publicPhoto: 'teamPhoto-1691368413181.png',
      linkedin: 'amandachen',
      email: 'amandachen@gmail.com',
    },
    {
      id: 'd678a1-19aa-1234-ee48-99a93726487d',
      name: 'Daniel Wong',
      username: 'danielwong',
      password: 'Danielwong1',
      roleId: '1a3173b6-c5ee-4311-9284-33aa28001575',
      photo: 'default-profile.png',
      publicPhoto: 'teamPhoto-1691368452809.png',
      linkedin: 'danielwong',
      email: 'danielwong@gmail.com',
    },
    {
      id: 'd678a1-19aa-1234-ee48-99a93726487e',
      name: 'Eric Nguyen',
      username: 'ericnguyen',
      password: 'Ericnguyen1',
      roleId: '8b36f02d-1ad3-4383-b181-ee4b06548242',
      photo: 'default-profile.png',
      publicPhoto: 'teamPhoto-1691368968523.png',
      linkedin: 'ericnguyen',
      email: 'ericnguyen@gmail.com',
    },
    {
      id: 'd678a1-19aa-1234-ee48-99a93726487f',
      name: 'Rachel Lee',
      username: 'rachellee',
      password: 'Rachellee1',
      roleId: 'be80805c-0e6c-4437-a076-1340851b66ae',
      photo: 'default-profile.png',
      publicPhoto: 'teamPhoto-1691368992118.png',
      linkedin: 'rachellee',
      email: 'rachellee@gmail.com',
    },
  ];
}

async function getRoles(): Promise<Role[]> {
  return [
    { id: '5d809598-f83a-4138-a8dd-29a937264876', name: 'Admin' },
    { id: 'faa7c49d-7a48-431b-bf29-500d8df65351', name: 'Digital Marketing Manager' },
    { id: '1a3173b6-c5ee-4311-9284-33aa28001575', name: 'Web Developer Expert' },
    { id: '8b36f02d-1ad3-4383-b181-ee4b06548242', name: 'Lead Developer' },
    { id: 'be80805c-0e6c-4437-a076-1340851b66ae', name: 'Sales Manager' },
  ];
}

async function getBlogs(): Promise<Blog[]> {
  return [
    {
      id: '08b182c6-7443-45fc-a1f6-8f28552780ad',
      title: "How to Increase your Website's Conversion Rate",
      slug: 'how-to-increase-your-websites-conversion-rate-1691896280925',
      description:
        'Learn valuable tips and tricks to optimize your website for increased conversion rates and drive more sales for your business.',
      coverImage: 'coverImage-1691896280912.jpg',
      content: `<p>As a website owner, you want your website to be more than just a pretty face. You want it to generate leads, make sales, and ultimately, increase revenue.</p><p>But how do you do that? The answer lies in your website's conversion rate - the percentage of visitors who take a desired action on your website, such as making a purchase or filling out a contact form.</p><p>In this blog post, we'll discuss some tips and tricks on how to increase your website's conversion rate.</p><p>&nbsp;</p><h2><strong>1. Optimize Your Website's Load Time</strong></h2><p>One of the most important factors that affect your website's conversion rate is the speed at which it loads. Slow load times can lead to high bounce rates and poor user experiences, which can ultimately lead to lower conversion rates. To optimize your website's load time, you can <a href="https://www.apeaksoft.com/free-online-image-compressor/compress-images-for-website.html#:~:text=How%20to%20Compress%20Web%20Images%20Online%20Step%201,and%20click%20the%20Open%20button%20to%20upload%20them.">compress images</a>, <a href="https://www.bing.com/search?q=what+is+minifying+code+&amp;qs=n&amp;form=QBRE&amp;sp=-1&amp;ghc=1&amp;lq=0&amp;pq=what+is+minifying+code+&amp;sc=7-23&amp;sk=&amp;cvid=AEF4AA60F24141F196DD3E7CC8D3BAA8&amp;ghsh=0&amp;ghacc=0&amp;ghpl=">minify your code</a>, and leverage <a href="https://www.bing.com/search?q=browser+caching&amp;qs=n&amp;form=QBRE&amp;sp=-1&amp;ghc=1&amp;lq=0&amp;pq=browser+cachin&amp;sc=6-14&amp;sk=&amp;cvid=3B95929B1DC14CC0A96FDC2991EFA15E&amp;ghsh=0&amp;ghacc=0&amp;ghpl=">browser caching</a>.</p><h2><strong>2. Make Your Website Mobile-Friendly</strong></h2><p>In today's mobile-first world, having a <a href="https://www.bing.com/search?q=mobile+friendly+website&amp;qs=n&amp;form=QBRE&amp;sp=-1&amp;ghc=1&amp;lq=0&amp;pq=mobile+friendly+website&amp;sc=7-23&amp;sk=&amp;cvid=BE4ACC3A3D074E259041A58160A56210&amp;ghsh=0&amp;ghacc=0&amp;ghpl=">mobile-friendly website</a> is essential for increasing your website's conversion rate. A mobile-friendly website ensures that your website is easy to navigate and read on smaller screens, making it more likely that visitors will stick around and take the desired action.</p><h2><strong>3. Use Clear and Compelling Calls-to-Action</strong></h2><p>Calls-to-action (CTAs) are the buttons or links on your website that encourage visitors to take a specific action, such as “Buy Now” or “Download Our Guide”. To increase your website's conversion rate, you should use clear and compelling CTAs that stand out and clearly communicate the value of taking the desired action.</p><h2><strong>4. Simplify Your Website's Navigation</strong></h2><p>Your website's navigation should be simple, intuitive, and easy to use. Visitors should be able to find what they're looking for quickly and easily, without having to navigate through multiple pages or confusing menus. Simplifying your website's navigation can help visitors find the information they need and ultimately take the desired action.</p><h2><strong>5. Use Social Proof</strong></h2><p>Social proof is the idea that people are more likely to take a desired action if they see others doing it first. To increase your website's conversion rate, you can use social proof in the form of customer reviews, ratings, and testimonials. Displaying these on your website can help build trust with visitors and increase the likelihood that they'll take the desired action.<br>&nbsp;</p><p>In conclusion, increasing your website's conversion rate requires a combination of technical optimization and user experience improvements. By following the tips and tricks outlined in this blog post, you can improve your website's load time, mobile-friendliness, navigation, and calls-to-action, as well as leverage social proof to build trust and encourage visitors to take the desired action.</p><p>&nbsp;</p>`,
      thumbnail: 'blogThumbnail-1691896280907.jpg',
      published: true,
      publishedAt: new Date('2023-08-13T03:32:00.384Z'),
      createdAt: new Date('2023-08-13T03:11:20.931Z'),
      updatedAt: new Date('2023-08-13T03:32:00.386Z'),
      authorId: 'd678a1-19aa-1234-ee48-99a93726487b',
    },
    {
      id: '20d9853f-a58e-4ab1-8812-cedb5143b4fa',
      title: 'Maximizing Your Social Media Presence',
      slug: 'maximizing-your-social-media-presence-1691897125736',
      description:
        'Get expert advice on how to make the most of your social media accounts and build a strong online presence for your business.',
      coverImage: 'coverImage-1691897125727.jpg',
      content: `<p>Social media has become an integral part of our daily lives, both personally and professionally. For businesses, having a strong and impactful presence on social media platforms is no longer an option but a necessity. A robust social media strategy can significantly contribute to brand awareness, customer engagement, lead generation, and overall business growth.&nbsp;</p><p>In this blog post, we will explore effective ways to maximize your social media presence to leverage its full potential and achieve tangible results for your business.</p><p>&nbsp;</p><h2><strong>1. Define Your Social Media Goals</strong></h2><p>Before diving into social media marketing, it is crucial to define clear and achievable goals. Whether it's increasing brand awareness, driving website traffic, generating leads, or enhancing customer engagement, setting specific objectives will provide direction to your social media efforts. Each goal should be measurable, time-bound, and aligned with your overall business objectives.</p><p>&nbsp;</p><h2><strong>2. Identify Your Target Audience</strong></h2><p>Understanding your target audience is paramount to crafting content that resonates with them. Conduct thorough research to identify the demographics, preferences, and behaviors of your target audience across different social media platforms. Tailor your content and messaging to cater to their interests and needs, which will lead to higher engagement and stronger connections with your audience.</p><p>&nbsp;</p><h2><strong>3. Choose the Right Social Media Platforms</strong></h2><p>Not all social media platforms are created equal, and not every platform may be suitable for your business. Select the platforms that align with your target audience and industry. For instance, if you have a visually appealing product, platforms like Instagram and Pinterest might be more suitable, while B2B businesses may find LinkedIn more effective for networking and lead generation.</p><p>&nbsp;</p><h2><strong>4. Create Engaging Content</strong></h2><p>Content is king on social media. To maximize your social media presence, create engaging and shareable content that adds value to your audience. Mix up different types of content, including images, videos, infographics, blog posts, and user-generated content. Encourage interactions with your audience through polls, quizzes, and contests to keep them actively engaged with your brand.</p><p>&nbsp;</p><h2><strong>5. Optimize Posting Times</strong></h2><p>Timing plays a significant role in social media success. Each platform has its peak activity times, and it's essential to post when your target audience is most active. Use social media analytics and scheduling tools to identify the best posting times and ensure your content reaches the maximum number of users.</p><p>&nbsp;</p><h2><strong>6. Leverage Influencer Marketing</strong></h2><p>Influencer marketing has become a powerful tool to reach a broader audience and build credibility for your brand. Collaborate with influencers who align with your brand values and have a significant following in your industry. Their endorsement can help increase brand awareness and trust among their followers, leading to potential customers for your business.</p><p>&nbsp;</p><h2><strong>7. Engage with Your Audience</strong></h2><p>Social media is a two-way street. Engage with your audience by responding to comments, messages, and mentions promptly. Encourage conversations and actively participate in discussions related to your industry. Building a strong rapport with your followers fosters loyalty and encourages them to become brand advocates.</p><p>&nbsp;</p><h2><strong>8. Monitor and Analyze Performance</strong></h2><p>Regularly monitor your social media performance through analytics tools provided by the platforms or third-party applications. Track key metrics such as reach, engagement, click-through rates, and conversions. Analyzing your social media data will provide valuable insights into what works and what needs improvement, allowing you to refine your strategy for better results.</p><p>&nbsp;</p><p>Maximizing your social media presence requires a well-planned and consistent effort. By defining clear goals, understanding your target audience, creating engaging content, and leveraging the right platforms, you can establish a strong social media presence that drives meaningful results for your business. Remember that social media is an ever-evolving landscape, so stay updated with the latest trends and adapt your strategy accordingly. With dedication and creativity, your business can thrive in the digital age through the power of social media.</p>`,
      thumbnail: 'blogThumbnail-1691897125726.jpg',
      published: true,
      publishedAt: new Date('2023-09-02T03:32:03.241Z'),
      createdAt: new Date('2023-08-28T03:11:20.931Z'),
      updatedAt: new Date('2023-08-28T03:11:20.931Z'),
      authorId: 'd678a1-19aa-1234-ee48-99a93726487d',
    },
    {
      id: '590b0f7b-2132-4439-bc98-bb33a1c81fe2',
      title: 'The Top Social Media Trends for 2022 You Need to Know',
      slug: 'the-top-social-media-trends-for-2022-you-need-to-know-1691897514193',
      description:
        'Get ahead of the curve with the latest trends in social media marketing and learn how to leverage them to grow your business.',
      coverImage: 'coverImage-1691897514189.jpg',
      content: `<p>Social media has become an integral part of our lives, shaping the way we communicate, share information, and engage with the world. As we step into the exciting realm of 2022, it's essential to keep a keen eye on the evolving landscape of social media trends that are set to redefine the way we interact online.</p><p>From emerging platforms to innovative features, let's explore the top social media trends that will dominate the digital sphere in 2022.</p><p>&nbsp;</p><h2><strong>1. &nbsp;Short-Form Video Dominance</strong></h2><p>Short-form videos are here to stay, and platforms like TikTok, Instagram Reels, and YouTube Shorts will continue to surge in popularity. Brands and creators will leverage these platforms to capture the attention of a fast-scrolling audience, offering bite-sized content that's entertaining, informative, and shareable.</p><p>&nbsp;</p><h2><strong>2. Niche Platforms Rise</strong></h2><p>While giants like Facebook and Twitter remain significant, niche platforms catering to specific interests or demographics will gain momentum. These platforms provide a more tailored experience, creating communities centered around shared passions and hobbies.</p><p>&nbsp;</p><h2><strong>3. Social Commerce Evolution</strong>&nbsp;</h2><p>Social commerce will see a significant evolution, with platforms integrating seamless shopping experiences directly into their interfaces. Look out for "shoppable" posts, where users can purchase products featured in posts without leaving the app.</p><p>&nbsp;</p><h2><strong>4. Augmented Reality (AR) Experiences</strong></h2><p>AR filters and effects will become even more immersive and interactive. Users can expect to see AR used not only for fun and entertainment but also for practical applications, like virtual try-ons and home design.</p><p>&nbsp;</p><h2><strong>5. Sustainability and Social Responsibility&nbsp;</strong>&nbsp;</h2><p>Brands and influencers will focus on sustainability and social responsibility, aligning themselves with causes that resonate with their audience. Transparent and authentic engagement with important issues will be essential to maintaining a positive image.</p><p>&nbsp;</p><h2><strong>6. Audio-First Engagement</strong></h2><p>The rise of Clubhouse and the integration of audio features across various platforms have paved the way for audio-first engagement. Podcasts, live audio chats, and voice interactions will continue to grow, offering new ways to connect.<br>&nbsp;</p><h2><strong>7. Privacy and Data Security</strong>&nbsp;</h2><p>With growing concerns about data privacy, social media platforms will face increasing pressure to enhance user data protection measures. Users will demand more control over their data and transparency from the platforms they use.</p><p>&nbsp;</p><h2><strong>8. Inclusivity and Diversity</strong></h2><p>The importance of diversity and inclusivity will take center stage. Brands and influencers that genuinely embrace and reflect a diverse audience will garner more significant engagement and support.</p><p>&nbsp;</p><h2><strong>9. Livestreaming Evolution</strong></h2><p>Livestreaming will continue to evolve beyond traditional uses. It will be used for product launches, virtual events, behind-the-scenes glimpses, and interactive Q&amp;A sessions.</p><p>&nbsp;</p><h2><strong>10. Personalization and AI</strong></h2><p>AI-powered algorithms will become more sophisticated, enabling platforms to offer highly personalized content feeds. Users will experience more relevant content, while brands will have new opportunities to reach their target audiences.</p><p>&nbsp;</p><p>In 2022, social media will be a dynamic and ever-changing landscape. Staying ahead of these trends is crucial for brands, creators, and everyday users looking to make the most of their online presence. Embrace these trends, experiment with new features, and keep an eye out for emerging platforms to stay at the forefront of the social media revolution.</p>`,
      thumbnail: 'blogThumbnail-1691897514189.jpg',
      published: true,
      publishedAt: new Date('2023-08-15T03:32:05.792Z'),
      createdAt: new Date('2023-08-12T03:32:05.792Z'),
      updatedAt: new Date('2023-08-12T03:32:05.792Z'),
      authorId: 'd678a1-19aa-1234-ee48-99a93726487f',
    },
    {
      id: 'c3806570-1a21-41e9-9173-798c4f52e575',
      title: 'The Importance of SEO for Your Business',
      slug: 'the-importance-of-seo-for-your-business-1691896805375',
      description:
        'Discover why SEO is a critical component of your digital marketing strategy and how to leverage it to improve your website.',
      coverImage: 'coverImage-1691896805370.jpg',
      content: `<p>In today's digital landscape, where competition is fierce and online visibility is essential, Search Engine Optimization (SEO) has emerged as a powerful tool for businesses to enhance their online presence and reach their target audience.&nbsp;</p><p>SEO plays a pivotal role in driving organic traffic to websites, improving search engine rankings, and ultimately boosting the overall success of a business. In this article, we will explore the significance of SEO for your business and provide valuable insights into leveraging it to enhance your website's performance.</p><p>&nbsp;</p><h2><strong>1. Increasing Online Visibility</strong></h2><p>When potential customers are looking for products or services related to your business, they are likely to use search engines to find what they need. Implementing effective SEO strategies helps your website rank higher on search engine result pages (SERPs), thereby increasing its visibility to users. The higher your website ranks, the more likely it is to attract organic traffic, leading to more potential customers discovering your brand.</p><p>&nbsp;</p><h2><strong>2. Driving Targeted Traffic</strong></h2><p>SEO enables you to optimize your website for relevant keywords and phrases that are commonly used by your target audience during their search. By targeting specific keywords that align with your business offerings, you attract visitors who are genuinely interested in what you have to offer. This targeted traffic is more likely to convert into leads and customers, resulting in higher conversion rates and better returns on your marketing efforts.</p><p>&nbsp;</p><h2><strong>3. Building Credibility and Trust</strong></h2><p>Websites that rank higher on search engines are often perceived as more trustworthy and credible by users. When your website appears on the first page of search results, it establishes your brand as an authoritative figure in your industry. This increased credibility not only enhances user trust but also helps build lasting relationships with your audience, making them more likely to choose your products or services over competitors.</p><p>&nbsp;</p><h2><strong>4. Cost-Effectiveness</strong></h2><p>Compared to traditional marketing methods, SEO offers a cost-effective approach to marketing your business. While paid advertising can deliver immediate results, it can be expensive and may not provide long-term benefits. On the other hand, SEO, when done right, can generate organic traffic over time without ongoing costs, making it a sustainable and budget-friendly strategy for businesses of all sizes.</p><p>&nbsp;</p><h2><strong>5. Enhancing User Experience</strong></h2><p>SEO is not solely about optimizing for search engines; it also focuses on providing an excellent user experience. Search engines value websites that are well-structured, fast, and user-friendly. By catering to user preferences and addressing their needs, you not only improve your search rankings but also ensure that visitors have a positive experience on your site, increasing the likelihood of conversions.</p><p>&nbsp;</p><h2><strong>6. Staying Ahead of Competitors</strong></h2><p>In today's highly competitive business landscape, neglecting SEO means handing over valuable market share to your competitors. When your competitors invest in SEO and outrank you in search results, they are more likely to attract potential customers who might have otherwise discovered your website. Embracing SEO helps you level the playing field and stay ahead of your competition in the digital realm.</p><p>&nbsp;</p><p>In conclusion, SEO is a critical component of any successful digital marketing strategy. It allows businesses to enhance their online visibility, attract targeted traffic, build credibility, and ultimately boost conversions and revenue. By focusing on optimizing your website for both search engines and users, you can create a robust online presence that drives sustainable growth for your business. Embrace the power of SEO and take your business to new heights in the digital world.</p>`,
      thumbnail: 'blogThumbnail-1691896805368.jpg',
      published: true,
      publishedAt: new Date('2023-10-10T03:32:07.915Z'),
      createdAt: new Date('2023-10-08T03:32:07.915Z'),
      updatedAt: new Date('2023-10-08T03:32:07.915Z'),
      authorId: 'd678a1-19aa-1234-ee48-99a93726487e',
    },
  ];
}

async function getClients(): Promise<Client[]> {
  return [
    { name: 'Amazon', logo: 'clientLogo-1689645227289.png' },
    { name: 'Apple', logo: 'clientLogo-1689645237712.png' },
    { name: 'Behance', logo: 'clientLogo-1689645248549.png' },
    { name: 'Dribbble', logo: 'clientLogo-1689645261165.png' },
    { name: 'Dropbox', logo: 'clientLogo-1689645274965.png' },
    { name: 'Google', logo: 'clientLogo-1689645287644.png' },
    { name: 'Paypal', logo: 'clientLogo-1689645297158.png' },
    { name: 'Slack', logo: 'clientLogo-1689645305707.png' },
  ];
}

async function getTestimonies(): Promise<Testimony[]> {
  return [
    {
      clientName: 'Max Robinson',
      clientPhoto: 'clientPhoto-1689729448928.png',
      occupation: 'Entrepreneur',
      message:
        'The team at this company is truly professional and skilled. They created a beautiful website for my business and helped me improve my SEO ranking. I will definitely work with them again.',
      rate: 3,
    },
    {
      clientName: 'Olivia Taylor',
      clientPhoto: 'clientPhoto-1689729847947.png',
      occupation: 'Creative Director',
      message:
        'Working with this company was a pleasure. They have a great eye for design and are able to execute projects quickly and efficiently. I would definitely recommend them to anyone looking for high-quality graphic design.',
      rate: 5,
    },
    {
      clientName: 'Robert Johnson',
      clientPhoto: 'clientPhoto-1689729870565.jpg',
      occupation: 'CEO',
      message:
        "The results speak for themselves. Since partnering with Hivemind, we've seen a significant increase in website traffic and lead generation. Their team's expertise and creativity have been invaluable to our digital marketing efforts.",
      rate: 5,
    },
    {
      clientName: 'Sarah Lee',
      clientPhoto: 'clientPhoto-1689729882182.png',
      occupation: 'E-commerce Manager',
      message:
        "Working with Hivemind has been a game-changer for our online store. Their e-commerce expertise has helped us streamline our sales process and optimize our website for maximum conversion. We couldn't be happier with the results.",
      rate: 5,
    },
    {
      clientName: 'John Smith',
      clientPhoto: 'clientPhoto-1689729891385.png',
      occupation: 'Marketing Manager',
      message:
        'I am very impressed with the quality of service and attention to detail provided by this company. They helped us increase our online presence and attract more customers. Highly recommended!',
      rate: 4.2,
    },
    {
      clientName: 'Maria Garcia',
      clientPhoto: 'clientPhoto-1689729901641.png',
      occupation: 'Real Estate Agent',
      message:
        "I've worked with several web design companies in the past, but none have delivered the same level of expertise and customer service as Hivemind. Their team took the time to understand my business and goals and created a website that truly reflects my brand. I would highly recommend their services.",
      rate: 4.5,
    },
  ];
}

async function getServices(): Promise<Service[]> {
  return [
    {
      id: '45f61d6c-89c6-4c11-8716-98e7c01f98b2',
      name: 'Web Design',
      thumbnail: 'thumbnail-1689734259611.svg',
      description:
        'Our team of expert designers creates visually stunning websites that are easy to navigate and optimized for conversion.',
    },
    {
      id: '3b684f3d-8040-4718-b0fe-f473e5b672f4',
      name: 'Search Engine Optimization',
      thumbnail: 'thumbnail-1689734296404.svg',
      description:
        'Our SEO specialists help you climb the rankings and increase visibility with proven techniques that drive organic traffic.',
    },
    {
      id: 'a76f9747-f66e-453e-bc2c-689436998cbb',
      name: 'Social Media Marketing',
      thumbnail: 'thumbnail-1689734323485.svg',
      description:
        'We develop customized social media strategies that drive engagement, increase followers, and ultimately boost your business.',
    },
    {
      id: '553af805-0fcd-4766-9719-a127869ffbe1',
      name: 'Content Creation',
      thumbnail: 'thumbnail-1689734349437.svg',
      description:
        'We create compelling, informative content that engages your audience and establishes your brand as an authority.',
    },
    {
      id: 'd398c9e1-6e18-4e06-8b92-eec939373021',
      name: 'E-commerce Solutions',
      thumbnail: 'thumbnail-1689734370520.svg',
      description:
        'We help you develop and optimize your online store, making it easy for customers to browse, shop, and checkout with confidence.',
    },
    {
      id: 'c0536139-d3e4-4aad-b771-61e3c457b9b9',
      name: 'Mobile App Development',
      thumbnail: 'thumbnail-1689734394304.svg',
      description:
        'Our experienced team of developers creates user-friendly, responsive apps that take your business to the next level.',
    },
  ];
}

async function getPortfolios(): Promise<Portfolio[]> {
  return [
    {
      id: '85f9bc0d-9791-44d7-9a97-b316822fd559',
      name: 'E-commerce for Fashion',
      orientation: 'PORTRAIT',
      thumbnail: 'portfolioThumbnail-1691891213269.png',
      serviceId: '45f61d6c-89c6-4c11-8716-98e7c01f98b2',
    },
    {
      id: '095cb904-7221-4d66-b02a-a7c131e2c7bc',
      name: 'Fitness Studio',
      orientation: 'LANDSCAPE',
      thumbnail: 'portfolioThumbnail-1691891231580.png',
      serviceId: 'c0536139-d3e4-4aad-b771-61e3c457b9b9',
    },
    {
      id: '14ea1266-1f55-44c1-9294-72b9f03426d5',
      name: 'SEO Opimization for E-commerce Website',
      orientation: 'LANDSCAPE',
      thumbnail: 'portfolioThumbnail-1691891248809.png',
      serviceId: '3b684f3d-8040-4718-b0fe-f473e5b672f4',
    },
    {
      id: '854e144b-8096-4483-bd1c-7c24278cbf06',
      name: 'Content Creation for Streamlined Organization',
      orientation: 'LANDSCAPE',
      thumbnail: 'portfolioThumbnail-1691891277042.png',
      serviceId: '553af805-0fcd-4766-9719-a127869ffbe1',
    },
    {
      id: '72698142-166e-49d2-be59-d24ba1a93d99',
      name: 'Construction Company Website',
      orientation: 'PORTRAIT',
      thumbnail: 'portfolioThumbnail-1691891303555.jpg',
      serviceId: '45f61d6c-89c6-4c11-8716-98e7c01f98b2',
    },
    {
      id: '07e227c1-044a-4b06-bd11-99916bb7fe8f',
      name: 'Jordan Shop',
      orientation: 'LANDSCAPE',
      thumbnail: 'portfolioThumbnail-1691891411668.png',
      serviceId: 'c0536139-d3e4-4aad-b771-61e3c457b9b9',
    },
    {
      id: '4c8b67cf-92e6-4771-8ab9-7e378fa9996b',
      name: 'Fear Of God Fashion Store',
      orientation: 'LANDSCAPE',
      thumbnail: 'portfolioThumbnail-1691891441648.png',
      serviceId: 'c0536139-d3e4-4aad-b771-61e3c457b9b9',
    },
    {
      id: '9c51df1e-2fc4-4a3e-86b7-9051d921125d',
      name: 'Eatly - Healthy Living Program',
      orientation: 'LANDSCAPE',
      thumbnail: 'portfolioThumbnail-1691891509104.png',
      serviceId: '45f61d6c-89c6-4c11-8716-98e7c01f98b2',
    },
    {
      id: 'a858bc5a-a5c8-4b9e-87e9-8e9ec0944aea',
      name: 'Stylish Shop',
      orientation: 'LANDSCAPE',
      thumbnail: 'portfolioThumbnail-1691891479503.png',
      serviceId: 'c0536139-d3e4-4aad-b771-61e3c457b9b9',
    },
  ];
}

async function getFAQs(): Promise<FAQ[]> {
  return [
    {
      question: 'What services does your company offer?',
      answer:
        'We offer a wide range of digital marketing services including SEO, PPC, social media marketing, email marketing, web design, and more.',
    },
    {
      question: 'How much does your service cost?',
      answer:
        'Our pricing varies depending on the specific service and scope of the project. We provide personalized quotes based on your unique needs and budget.',
    },
    {
      question: 'Do you provide ongoing support and maintenance?',
      answer:
        'Yes, we offer ongoing support and maintenance services to ensure that your website or digital presence remains up-to-date and secure.',
    },
    {
      question: 'How can I get started working with your agency?',
      answer:
        "The first step is to reach out to us via our contact page or by calling us directly (please pay attention to our business hours). We'll set up an initial consultation to discuss your needs and provide you with a personalized quote and proposal.",
    },
    {
      question: 'How do you measure the success of a project?',
      answer:
        'We use a variety of metrics to measure the success of our projects, including website traffic, engagement rates, conversion rates, and more. We work with our clients to establish clear goals and objectives for each project and use these metrics to track progress.',
    },
  ];
}

async function getSubscribers(): Promise<Omit<Subscriber, 'id'>[]> {
  return [
    { email: 'darmayasadiputra@gmail.com' },
    { email: 'adiputrakadekdarmayasa@gmai.com' },
    { email: 'johndoe@gmail.com' },
  ];
}

async function seed() {
  const [users, roles, services, portfolios, clients, testimonies, faqs, subscribers, blogs] =
    await Promise.all([
      getUsers(),
      getRoles(),
      getServices(),
      getPortfolios(),
      getClients(),
      getTestimonies(),
      getFAQs(),
      getSubscribers(),
      getBlogs(),
    ]);

  await Promise.all([
    db.role.createMany({ data: roles }),
    db.client.createMany({ data: clients }),
    db.service.createMany({ data: services }),
    db.testimony.createMany({ data: testimonies }),
    db.faq.createMany({ data: faqs }),
    db.subscriber.createMany({ data: subscribers }),
  ]);

  for (const user of users) {
    await db.user.create({
      data: {
        ...user,
        password: bcrypt.hashSync(user.password, bcrypt.genSaltSync(8)),
      },
    });
  }

  await db.blog.createMany({ data: blogs });
  await db.portfolio.createMany({ data: portfolios });
}

seed()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
