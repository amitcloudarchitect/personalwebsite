import { useMemo, useState } from 'react'
import { ArticleCard } from '@/components/ArticleCard'
import { FilterBar } from '@/components/FilterBar'
import { PageIntro } from '@/components/PageIntro'
import { Seo } from '@/components/Seo'
import { articleCategoryOrder, articles } from '@/data/articles'

export default function ArticlesPage() {
  const [category, setCategory] = useState('All')
  const filtered = useMemo(
    () => (category === 'All' ? articles : articles.filter((article) => article.category === category)),
    [category],
  )

  return (
    <>
      <Seo
        title="Articles"
        description="Technical writing by Amit Kumar on cloud, Azure, AWS, AI, architecture, FinOps, security, and operations. Unpublished entries are marked as placeholders."
        path="/articles"
      />
      <PageIntro
        eyebrow="Articles"
        title="Technical writing"
        lede="Internal Markdown articles and links to external publications live here. Cards marked Placeholder are templates, not published pieces."
      >
        <FilterBar label="Filter articles by category" options={['All', ...articleCategoryOrder]} value={category} onChange={setCategory} />
      </PageIntro>
      <div className="mx-auto grid max-w-6xl gap-4 px-5 py-12 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </>
  )
}
