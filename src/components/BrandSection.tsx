const BrandSection = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-8 lowercase tracking-tight">
          our story
        </h2>
        
        <div className="space-y-8 text-lg md:text-xl leading-relaxed text-muted-foreground max-w-3xl mx-auto">
          <p>
            we believe in the power of random acts of kindness. but we also believe 
            those acts should be <span className="text-primary font-medium">rewarded</span>.
          </p>
          
          <p>
            cash karma isn't just another app. it's a movement. a club. a place where 
            generosity meets gamification, where giving feels as good as receiving, 
            and where every drop of karma creates ripples across the universe.
          </p>
          
          <p>
            we built this for the <span className="text-accent font-medium">bold</span> who dare to give first, 
            the <span className="text-primary font-medium">kind</span> who lead with love, 
            and the <span className="text-neon-purple font-medium">curious</span> who want to see what happens 
            when strangers become family through small acts of magic.
          </p>
        </div>

        <div className="mt-16 inline-flex items-center gap-2 px-6 py-3 bg-card/30 backdrop-blur-sm border border-border/20 rounded-full">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-sm text-muted-foreground">building community, one drop at a time</span>
        </div>
      </div>
    </section>
  );
};

export default BrandSection;