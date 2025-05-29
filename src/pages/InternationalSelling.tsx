import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Globe, DollarSign, Languages, Truck, Settings, Check, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/button';

const InternationalSelling: React.FC = () => {
  const [activeTab, setActiveTab] = useState('markets');
  const [enabledMarkets, setEnabledMarkets] = useState<string[]>(['us', 'ca', 'uk']);
  const [loading, setLoading] = useState(false);
  
  const markets = [
    { id: 'us', name: 'United States', currency: 'USD', flag: '🇺🇸', enabled: true },
    { id: 'ca', name: 'Canada', currency: 'CAD', flag: '🇨🇦', enabled: true },
    { id: 'uk', name: 'United Kingdom', currency: 'GBP', flag: '🇬🇧', enabled: true },
    { id: 'au', name: 'Australia', currency: 'AUD', flag: '🇦🇺', enabled: false },
    { id: 'de', name: 'Germany', currency: 'EUR', flag: '🇩🇪', enabled: false },
    { id: 'fr', name: 'France', currency: 'EUR', flag: '🇫🇷', enabled: false },
    { id: 'it', name: 'Italy', currency: 'EUR', flag: '🇮🇹', enabled: false },
    { id: 'es', name: 'Spain', currency: 'EUR', flag: '🇪🇸', enabled: false },
    { id: 'jp', name: 'Japan', currency: 'JPY', flag: '🇯🇵', enabled: false },
    { id: 'mx', name: 'Mexico', currency: 'MXN', flag: '🇲🇽', enabled: false },
    { id: 'br', name: 'Brazil', currency: 'BRL', flag: '🇧🇷', enabled: false },
    { id: 'in', name: 'India', currency: 'INR', flag: '🇮🇳', enabled: false }
  ];
  
  const handleToggleMarket = async (marketId: string) => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (enabledMarkets.includes(marketId)) {
        setEnabledMarkets(enabledMarkets.filter(id => id !== marketId));
      } else {
        setEnabledMarkets([...enabledMarkets, marketId]);
      }
    } catch (error) {
      console.error('Error toggling market:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">International Selling</h1>
        <p className="text-gray-600">
          Expand your business globally with multi-currency and language support.
        </p>
      </div>

      <Tabs defaultValue="markets" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="markets" className="flex items-center">
            <Globe className="h-4 w-4 mr-2" />
            <span>Markets</span>
          </TabsTrigger>
          <TabsTrigger value="currencies" className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2" />
            <span>Currencies</span>
          </TabsTrigger>
          <TabsTrigger value="languages" className="flex items-center">
            <Languages className="h-4 w-4 mr-2" />
            <span>Languages</span>
          </TabsTrigger>
          <TabsTrigger value="shipping" className="flex items-center">
            <Truck className="h-4 w-4 mr-2" />
            <span>Shipping</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="markets">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Available Markets</h3>
              <span className="text-sm text-gray-500">
                {enabledMarkets.length} of {markets.length} markets enabled
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {markets.map(market => (
                <div
                  key={market.id}
                  className={`border rounded-lg p-4 ${
                    enabledMarkets.includes(market.id)
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{market.flag}</span>
                      <div>
                        <h4 className="font-medium text-gray-900">{market.name}</h4>
                        <p className="text-sm text-gray-500">{market.currency}</p>
                      </div>
                    </div>
                    <div className="relative inline-block w-12 align-middle select-none">
                      <input
                        type="checkbox"
                        id={`toggle-${market.id}`}
                        checked={enabledMarkets.includes(market.id)}
                        onChange={() => handleToggleMarket(market.id)}
                        className="sr-only"
                        disabled={loading}
                      />
                      <label
                        htmlFor={`toggle-${market.id}`}
                        className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                          enabledMarkets.includes(market.id) ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                            enabledMarkets.includes(market.id) ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        ></span>
                      </label>
                    </div>
                  </div>
                  
                  {enabledMarkets.includes(market.id) && (
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <div className="flex items-center text-sm text-blue-600">
                        <Check className="h-4 w-4 mr-1" />
                        <span>Market enabled</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="currencies">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Currency Settings</h3>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Base Currency</h4>
                <div className="flex items-center p-4 bg-gray-50 rounded-md">
                  <DollarSign className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="font-medium">USD - US Dollar</p>
                    <p className="text-sm text-gray-500">All other currencies will be converted from this base currency</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Enabled Currencies</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {['USD', 'EUR', 'GBP', 'CAD', 'AUD'].map(currency => (
                    <div key={currency} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="font-medium">{currency}</span>
                          <span className="ml-2 text-sm text-gray-500">
                            {currency === 'USD' ? 'US Dollar' :
                             currency === 'EUR' ? 'Euro' :
                             currency === 'GBP' ? 'British Pound' :
                             currency === 'CAD' ? 'Canadian Dollar' :
                             'Australian Dollar'}
                          </span>
                        </div>
                        <div className="relative inline-block w-12 align-middle select-none">
                          <input
                            type="checkbox"
                            id={`toggle-${currency}`}
                            checked={true}
                            className="sr-only"
                          />
                          <label
                            htmlFor={`toggle-${currency}`}
                            className="block overflow-hidden h-6 rounded-full cursor-pointer bg-blue-500"
                          >
                            <span
                              className="block h-6 w-6 rounded-full bg-white transform translate-x-6"
                            ></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border border-dashed rounded-lg p-4 flex items-center justify-center">
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Currency
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Currency Display</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto-convert prices</p>
                      <p className="text-sm text-gray-500">Automatically convert prices based on current exchange rates</p>
                    </div>
                    <div className="relative inline-block w-12 align-middle select-none">
                      <input
                        type="checkbox"
                        id="toggle-auto-convert"
                        checked={true}
                        className="sr-only"
                      />
                      <label
                        htmlFor="toggle-auto-convert"
                        className="block overflow-hidden h-6 rounded-full cursor-pointer bg-blue-500"
                      >
                        <span
                          className="block h-6 w-6 rounded-full bg-white transform translate-x-6"
                        ></span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show currency symbol</p>
                      <p className="text-sm text-gray-500">Display currency symbol before or after the price</p>
                    </div>
                    <select className="px-3 py-2 border border-gray-300 rounded-md">
                      <option value="before">Before (e.g., $100)</option>
                      <option value="after">After (e.g., 100€)</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Price rounding</p>
                      <p className="text-sm text-gray-500">Round converted prices to nearest value</p>
                    </div>
                    <select className="px-3 py-2 border border-gray-300 rounded-md">
                      <option value="none">No rounding</option>
                      <option value="0.5">Nearest 0.5</option>
                      <option value="1">Nearest 1</option>
                      <option value="5">Nearest 5</option>
                      <option value="10">Nearest 10</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="languages">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Language Settings</h3>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Default Language</h4>
                <div className="flex items-center p-4 bg-gray-50 rounded-md">
                  <Globe className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="font-medium">English (en-US)</p>
                    <p className="text-sm text-gray-500">This is the primary language for your store</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Enabled Languages</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { code: 'en', name: 'English', flag: '🇺🇸' },
                    { code: 'fr', name: 'French', flag: '🇫🇷' },
                    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
                    { code: 'de', name: 'German', flag: '🇩🇪' },
                    { code: 'it', name: 'Italian', flag: '🇮🇹' }
                  ].map(language => (
                    <div key={language.code} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-xl mr-2">{language.flag}</span>
                          <span className="font-medium">{language.name}</span>
                        </div>
                        <div className="relative inline-block w-12 align-middle select-none">
                          <input
                            type="checkbox"
                            id={`toggle-${language.code}`}
                            checked={true}
                            className="sr-only"
                          />
                          <label
                            htmlFor={`toggle-${language.code}`}
                            className="block overflow-hidden h-6 rounded-full cursor-pointer bg-blue-500"
                          >
                            <span
                              className="block h-6 w-6 rounded-full bg-white transform translate-x-6"
                            ></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border border-dashed rounded-lg p-4 flex items-center justify-center">
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Language
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Translation Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto-translate content</p>
                      <p className="text-sm text-gray-500">Automatically translate product content to enabled languages</p>
                    </div>
                    <div className="relative inline-block w-12 align-middle select-none">
                      <input
                        type="checkbox"
                        id="toggle-auto-translate"
                        checked={true}
                        className="sr-only"
                      />
                      <label
                        htmlFor="toggle-auto-translate"
                        className="block overflow-hidden h-6 rounded-full cursor-pointer bg-blue-500"
                      >
                        <span
                          className="block h-6 w-6 rounded-full bg-white transform translate-x-6"
                        ></span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Translation quality</p>
                      <p className="text-sm text-gray-500">Choose between faster or more accurate translations</p>
                    </div>
                    <select className="px-3 py-2 border border-gray-300 rounded-md">
                      <option value="standard">Standard</option>
                      <option value="premium">Premium (AI-enhanced)</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Human review</p>
                      <p className="text-sm text-gray-500">Send translations for human review before publishing</p>
                    </div>
                    <div className="relative inline-block w-12 align-middle select-none">
                      <input
                        type="checkbox"
                        id="toggle-human-review"
                        checked={false}
                        className="sr-only"
                      />
                      <label
                        htmlFor="toggle-human-review"
                        className="block overflow-hidden h-6 rounded-full cursor-pointer bg-gray-300"
                      >
                        <span
                          className="block h-6 w-6 rounded-full bg-white transform translate-x-0"
                        ></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="shipping">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">International Shipping</h3>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Shipping Zones</h4>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-medium">North America</h5>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Countries</p>
                        <p className="text-sm">United States, Canada, Mexico</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Shipping Methods</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Standard (5-7 days)
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Express (2-3 days)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-medium">Europe</h5>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Countries</p>
                        <p className="text-sm">United Kingdom, Germany, France, Italy, Spain, and 22 more</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Shipping Methods</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Standard (7-10 days)
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Express (3-5 days)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-medium">Asia Pacific</h5>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Countries</p>
                        <p className="text-sm">Australia, Japan, Singapore, and 15 more</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Shipping Methods</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Standard (10-14 days)
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Express (5-7 days)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-dashed rounded-lg p-4 flex items-center justify-center">
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Shipping Zone
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Customs & Duties</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Display customs information</p>
                      <p className="text-sm text-gray-500">Show customs and duties information to international customers</p>
                    </div>
                    <div className="relative inline-block w-12 align-middle select-none">
                      <input
                        type="checkbox"
                        id="toggle-customs"
                        checked={true}
                        className="sr-only"
                      />
                      <label
                        htmlFor="toggle-customs"
                        className="block overflow-hidden h-6 rounded-full cursor-pointer bg-blue-500"
                      >
                        <span
                          className="block h-6 w-6 rounded-full bg-white transform translate-x-6"
                        ></span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Duties handling</p>
                      <p className="text-sm text-gray-500">Choose how duties and taxes are handled</p>
                    </div>
                    <select className="px-3 py-2 border border-gray-300 rounded-md">
                      <option value="ddu">DDU - Duties paid by customer</option>
                      <option value="ddp">DDP - Duties paid by merchant</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-md">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">International Shipping Compliance</h4>
                    <p className="mt-1 text-sm text-yellow-700">
                      Ensure you're compliant with international shipping regulations and restrictions.
                      Some products may be prohibited from shipping to certain countries.
                    </p>
                    <a
                      href="#"
                      className="mt-2 text-sm font-medium text-yellow-600 hover:text-yellow-800 inline-block"
                    >
                      View Compliance Guide
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InternationalSelling;