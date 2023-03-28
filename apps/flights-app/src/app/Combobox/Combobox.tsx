import { FC, Fragment, useEffect, useRef, useState } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { useVirtualizer } from '@tanstack/react-virtual';
import './Combobox.scss';
import { Airport } from '@govemap/flights-app-common';

export const AirportsCombo: FC<{
  airports: Airport[];
  onChange: (airport: Airport) => void;
}> = ({ airports, onChange }) => {
  const [selected, setSelected] = useState(airports?.[0]);
  const [query, setQuery] = useState('');
  const optionsListElm = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: airports.length,
    getScrollElement: () => optionsListElm.current,
    estimateSize: () => 35,
  });

  useEffect(() => {
    onChange(selected);
  }, [onChange, selected]);

  const filteredAirports =
    query === ''
      ? airports
      : airports.filter(({ nameAirport, nameCountry }) =>
          `${nameAirport} ${nameCountry}`
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        );

  return (
    <div className="w-72">
      <Combobox value={selected} onChange={setSelected}>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              displayValue={({ nameAirport, nameCountry }: Airport) =>
                `${nameCountry}-${nameAirport}`
              }
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options ref={optionsListElm} className="options-con">
              {filteredAirports.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                <div
                  style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                  }}
                >
                  {rowVirtualizer.getVirtualItems().map((virtualRow: any) => {
                    const airport = filteredAirports?.[virtualRow.index];
                    return (
                      airport && (
                        <div
                          key={virtualRow.index}
                          className={
                            virtualRow.index % 2
                              ? 'ListItemOdd'
                              : 'ListItemEven'
                          }
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: `${virtualRow.size}px`,
                            transform: `translateY(${virtualRow.start}px)`,
                          }}
                        >
                          {
                            <Combobox.Option
                              key={airport.codeIataAirport}
                              className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                  active
                                    ? 'bg-teal-600 text-white'
                                    : 'text-gray-900'
                                }`
                              }
                              value={airport}
                            >
                              {({ selected, active }) => (
                                <>
                                  <span
                                    className={`block truncate ${
                                      selected ? 'font-medium' : 'font-normal'
                                    }`}
                                  >
                                    {`${airport.nameCountry}-${airport.nameAirport}`}
                                  </span>
                                  {selected ? (
                                    <span
                                      className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                        active ? 'text-white' : 'text-teal-600'
                                      }`}
                                    >
                                      <CheckIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Combobox.Option>
                          }
                        </div>
                      )
                    );
                  })}
                </div>
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};
