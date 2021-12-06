import { ReactElement } from 'react';

import Image from 'next/image'
import Link from 'next/link';

const items = [
  {
    id: 1,
    name: 'Earthen Bottle',
    href: '/items/1',
    price: '$48',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg',
  },
  {
    id: 2,
    name: 'Nomad Tumbler',
    href: '/items/2',
    price: '$35',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg',
  },
]

const MyPage = (): ReactElement => {
  return (
    <div className="w-full">
      <main className="bg-white">
        <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {items.map((item) => (
              <Link key={item.id} href={item.href} >
                <a className="group">
                  <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                    <Image
                      src={item.imageSrc}
                      className="w-full h-full object-center object-cover group-hover:opacity-75"
                      layout="fill"
                    />
                  </div>
                  <h3 className="mt-4 text-sm text-gray-700">{item.name}</h3>
                  <p className="mt-1 text-lg font-medium text-gray-900">{item.price}</p>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default MyPage;
