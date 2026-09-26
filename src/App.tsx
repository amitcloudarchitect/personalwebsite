import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'

const HomePage = lazy(() => import('@/pages/HomePage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const ExperiencePage = lazy(() => import('@/pages/ExperiencePage'))
const ProjectsPage = lazy(() => import('@/pages/ProjectsPage'))
const ProjectDetailPage = lazy(() => import('@/pages/ProjectDetailPage'))
const SolutionsPage = lazy(() => import('@/pages/SolutionsPage'))
const SolutionDetailPage = lazy(() => import('@/pages/SolutionDetailPage'))
const AiLabPage = lazy(() => import('@/pages/AiLabPage'))
const AiLabDetailPage = lazy(() => import('@/pages/AiLabDetailPage'))
const ArticlesPage = lazy(() => import('@/pages/ArticlesPage'))
const ArticleDetailPage = lazy(() => import('@/pages/ArticleDetailPage'))
const VideosPage = lazy(() => import('@/pages/VideosPage'))
const CertificationsPage = lazy(() => import('@/pages/CertificationsPage'))
const SpeakingPage = lazy(() => import('@/pages/SpeakingPage'))
const ArchitecturePage = lazy(() => import('@/pages/ArchitecturePage'))
const ArchitectureDetailPage = lazy(() => import('@/pages/ArchitectureDetailPage'))
const ContactPage = lazy(() => import('@/pages/ContactPage'))
const SearchPage = lazy(() => import('@/pages/SearchPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="experience" element={<ExperiencePage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:slug" element={<ProjectDetailPage />} />
        <Route path="solutions" element={<SolutionsPage />} />
        <Route path="solutions/:slug" element={<SolutionDetailPage />} />
        <Route path="ai-lab" element={<AiLabPage />} />
        <Route path="ai-lab/:slug" element={<AiLabDetailPage />} />
        <Route path="articles" element={<ArticlesPage />} />
        <Route path="articles/:slug" element={<ArticleDetailPage />} />
        <Route path="videos" element={<VideosPage />} />
        <Route path="certifications" element={<CertificationsPage />} />
        <Route path="speaking" element={<SpeakingPage />} />
        <Route path="architecture" element={<ArchitecturePage />} />
        <Route path="architecture/:slug" element={<ArchitectureDetailPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
