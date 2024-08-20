import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { useSelector } from 'react-redux';
import { useActions } from '../../hooks/actions';
import { useGetPlayerIdMutation } from '../../store/api/cave-drone-server/cave-drone-server.api';

const complexityLevels = Array.from({ length: 10 }, (_, i) => i + 1);

export function PlayerForm({ assignPlayerId }) {
  const { closeModal, setPlayerData } = useActions();
  const [gameSettings, setGameSettings] = useState({ name: "", complexity: 1 })
  const { isOpen } = useSelector(state => state.playerFormModal);
  const [getPlayerId] = useGetPlayerIdMutation();

  const handleForm = (event) => {
    event.preventDefault();
    if (gameSettings.name.length > 0) {
      getPlayerId({ userData: gameSettings }).unwrap().then((data) => {
        const newData = {
          ...gameSettings,
          ...data
        }
        assignPlayerId(data.id);
        setPlayerData(newData);
        closeModal();
      })
    } else {
      return toast.error("You need to enter name!", { duration: 1000 })
    }
  }

  const handleInput = (e) => {
    const name = e.target.name;
    const filledSettings = { ...gameSettings };
    filledSettings[name] = name === "complexity" ? Number(e.target.value) : e.target.value;
    setGameSettings(filledSettings);
  }

  return (
    <Dialog open={isOpen} onClose={closeModal} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <form onSubmit={(e) => handleForm(e)}>
                <div className='mb-2'>
                  <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                    Please, enter your name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    minLength={2}
                    onChange={(e) => handleInput(e)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <div>
                  <label htmlFor="complexity" className="block text-sm font-medium leading-6 text-gray-900">
                    Choose the complexity
                  </label>
                  <select
                    id="complexity"
                    name="complexity"
                    onChange={(e) => handleInput(e)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    {complexityLevels.map(level => (
                      <option value={level} key={level}>{level}</option>
                    ))
                    }
                  </select>
                </div>
                <div className=" px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    className="inline-flex w-full justify-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 sm:ml-3 sm:w-auto"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    data-autofocus
                    onClick={() => closeModal()}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </DialogPanel>
        </div>
      </div>
      <Toaster richColors position="top-center" />
    </Dialog>
  )
}
