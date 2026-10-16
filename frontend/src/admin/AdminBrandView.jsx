import { getImageUrl } from '../utils/imageUrl'
import React, { useEffect, useState } from 'react'
import { ArrowLeft, Pencil, Image as ImageIcon } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { axiosInstance } from '../config/axiosConfig'
import AdminBreadCrumb from './AdminBreadCrumb'

export default function AdminBrandView() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [brand, setBrand] = useState(null)
  const [loading, setLoading] = useState(true)

  // GET BRAND
  const getBrand = async () => {
    try {
      setLoading(true)

      const res = await axiosInstance.get(`/brand/${id}`)

      setBrand(res.data.data)
    } catch (error) {
      console.error('Get brand error:', error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getBrand()
  }, [id])

  // IMAGE URL
  // LOADING
  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <p className="text-sm font-medium text-mk-muted-admin">Loading brand...</p>
      </div>
    )
  }

  // NOT FOUND
  if (!brand) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center">
        <p className="text-sm font-semibold text-mk-ink-admin">Brand not found</p>

        <button type="button" onClick={() => navigate('/admin/brand')} className="mt-4 rounded-xl bg-mk-admin px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-mk-ink-admin">
          Back to Brands
        </button>
      </div>
    )
  }

  const items = [
    {
      title: 'Brands',
      link: '/admin/brand',
    },
    {
      title: brand.brandName,
      link: null,
    },
  ]

  return (
    <div className="space-y-6">
      <AdminBreadCrumb items={items} />

      {/* BRAND MAIN CARD */}
      <div className="overflow-hidden rounded-2xl border border-mk-border-admin bg-white">
        <div className="grid grid-cols-1 gap-8 p-5 lg:grid-cols-[360px_1fr]">
          {/* BRAND LOGO */}
          <div>
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-mk-border-admin bg-mk-bg-admin">
              {brand.brandLogo ? (
                <img src={getImageUrl(brand.brandLogo)} alt={brand.brandName} className="h-full w-full object-contain p-8" />
              ) : (
                <div className="text-center">
                  <ImageIcon size={40} className="mx-auto text-mk-subtle" />

                  <p className="mt-2 text-sm text-mk-subtle">No logo available</p>
                </div>
              )}
            </div>
          </div>

          {/* BASIC BRAND INFO */}
          <div>
            {/* BRAND NAME */}
            <div className="border-b border-mk-border-admin pb-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-mk-subtle">Brand</p>

                  <h2 className="mt-1 text-2xl font-bold text-mk-ink-admin">{brand.brandName}</h2>
                </div>

                {/* STATUS */}
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${brand.status === 'Active' ? 'bg-mk-surface text-mk-admin-hover' : 'bg-mk-danger-soft text-mk-danger'}`}>
                  <span className={`size-1.5 rounded-full ${brand.status === 'Active' ? 'bg-mk-admin' : 'bg-mk-danger'}`} />

                  {brand.status}
                </span>
              </div>
            </div>

            {/* QUICK INFO */}
            <div className="grid grid-cols-1 gap-3 py-5 sm:grid-cols-2">
              <div className="rounded-xl bg-mk-surface p-4">
                <p className="text-[11px] text-mk-subtle">Brand Name</p>

                <p className="mt-1 text-sm font-bold text-mk-ink-admin">{brand.brandName || '-'}</p>
              </div>

              <div className="rounded-xl bg-mk-surface p-4">
                <p className="text-[11px] text-mk-subtle">Status</p>

                <span className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${brand.status === 'Active' ? 'bg-mk-surface text-mk-admin-hover' : 'bg-mk-danger-soft text-mk-danger'}`}>
                  <span className={`size-1.5 rounded-full ${brand.status === 'Active' ? 'bg-mk-admin' : 'bg-mk-danger'}`} />

                  {brand.status}
                </span>
              </div>
            </div>

            {/* LOGO */}
            <div className="border-t border-mk-border-admin pt-5">
              <p className="text-[11px] text-mk-subtle">Brand Logo</p>

              <p className="mt-1 break-all text-sm font-semibold text-mk-ink-admin">{brand.brandLogo || '-'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="rounded-2xl border border-mk-border-admin bg-white p-5">
        <div className="border-b border-mk-border-admin pb-4">
          <h3 className="text-base font-bold text-mk-ink-admin">Brand Description</h3>
        </div>

        <p className="pt-4 text-sm leading-7 text-mk-muted-admin">{brand.description || 'No description available.'}</p>
      </div>
    </div>
  )
}
