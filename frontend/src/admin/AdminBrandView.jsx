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
  const getImageUrl = (image) => {
    if (!image) return ''

    if (image.startsWith('http')) {
      return image
    }

    return `http://localhost:3000${image}`
  }

  // LOADING
  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <p className="text-sm font-medium text-[#6F6A64]">Loading brand...</p>
      </div>
    )
  }

  // NOT FOUND
  if (!brand) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center">
        <p className="text-sm font-semibold text-[#292725]">Brand not found</p>

        <button type="button" onClick={() => navigate('/admin/brand')} className="mt-4 rounded-xl bg-[#6B6258] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3F3A35]">
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
      <div className="overflow-hidden rounded-2xl border border-[#E3DED6] bg-white">
        <div className="grid grid-cols-1 gap-8 p-5 lg:grid-cols-[360px_1fr]">
          {/* BRAND LOGO */}
          <div>
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-[#E3DED6] bg-[#F8F6F2]">
              {brand.brandLogo ? (
                <img src={getImageUrl(brand.brandLogo)} alt={brand.brandName} className="h-full w-full object-contain p-8" />
              ) : (
                <div className="text-center">
                  <ImageIcon size={40} className="mx-auto text-[#99938B]" />

                  <p className="mt-2 text-sm text-[#99938B]">No logo available</p>
                </div>
              )}
            </div>
          </div>

          {/* BASIC BRAND INFO */}
          <div>
            {/* BRAND NAME */}
            <div className="border-b border-[#E3DED6] pb-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-[#99938B]">Brand</p>

                  <h2 className="mt-1 text-2xl font-bold text-[#292725]">{brand.brandName}</h2>
                </div>

                {/* STATUS */}
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${brand.status === 'Active' ? 'bg-[#EAE7E1] text-[#5D554C]' : 'bg-[#F1E7E5] text-[#A44A3F]'}`}>
                  <span className={`size-1.5 rounded-full ${brand.status === 'Active' ? 'bg-[#6B6258]' : 'bg-[#A44A3F]'}`} />

                  {brand.status}
                </span>
              </div>
            </div>

            {/* QUICK INFO */}
            <div className="grid grid-cols-1 gap-3 py-5 sm:grid-cols-2">
              <div className="rounded-xl bg-[#F1EEE8] p-4">
                <p className="text-[11px] text-[#99938B]">Brand Name</p>

                <p className="mt-1 text-sm font-bold text-[#292725]">{brand.brandName || '-'}</p>
              </div>

              <div className="rounded-xl bg-[#F1EEE8] p-4">
                <p className="text-[11px] text-[#99938B]">Status</p>

                <span className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${brand.status === 'Active' ? 'bg-[#EAE7E1] text-[#5D554C]' : 'bg-[#F1E7E5] text-[#A44A3F]'}`}>
                  <span className={`size-1.5 rounded-full ${brand.status === 'Active' ? 'bg-[#6B6258]' : 'bg-[#A44A3F]'}`} />

                  {brand.status}
                </span>
              </div>
            </div>

            {/* LOGO */}
            <div className="border-t border-[#E3DED6] pt-5">
              <p className="text-[11px] text-[#99938B]">Brand Logo</p>

              <p className="mt-1 break-all text-sm font-semibold text-[#292725]">{brand.brandLogo || '-'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="rounded-2xl border border-[#E3DED6] bg-white p-5">
        <div className="border-b border-[#E3DED6] pb-4">
          <h3 className="text-base font-bold text-[#292725]">Brand Description</h3>
        </div>

        <p className="pt-4 text-sm leading-7 text-[#6F6A64]">{brand.description || 'No description available.'}</p>
      </div>
    </div>
  )
}
