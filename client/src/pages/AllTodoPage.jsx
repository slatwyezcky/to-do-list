import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import Todo from '../components/Todo'
import CustomButton from '../components/CustomButton'

import { areaCheckbox, importanceCheckbox } from '../utils/constants'
import { sad } from '../assets'
import ImportanceInput from '../components/Form/ImportanceInput'
import AreaInput from '../components/Form/AreaInput'

const AllTodoPage = () => {
    const [areaList, setAreaList] = useState(areaCheckbox)
    const [importance, setImportance] = useState(importanceCheckbox)
    const [searchQuery, setSearchQuery] = useState('')
    const [todoList] = useState(
        JSON.parse(localStorage.getItem('todoList')).data
    )

    const handleImportance = (id) => {
        const updatedList = importance.map((el) => {
            if (el.id === id) {
                return {
                    ...el,
                    checked: true,
                }
            } else
                return {
                    ...el,
                    checked: false,
                }
        })
        setImportance(updatedList)
    }
    const handleAreaList = (id) => {
        const updatedList = areaList.map((el) => {
            if (el.id === id)
                return {
                    ...el,
                    checked: !el.checked,
                }
            else return el
        })
        setAreaList(updatedList)
    }

    const filteredList = useMemo(() => {
        const currentAreas = areaList
            .filter((area) => area.checked === true)
            .map((area) => area.title)
        const currentImportance = importance.filter((el) => el.checked === true)
        let filterSearchQuery = todoList.filter(
            (todo) =>
                todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                todo.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
        )

        if (currentAreas.length)
            filterSearchQuery = filterSearchQuery.filter((todo) =>
                currentAreas.every((el) => todo.area.includes(el))
            )
        if (currentImportance.length)
            filterSearchQuery = filterSearchQuery.filter(
                (todo) => todo.importance === currentImportance[0].title
            )
        return filterSearchQuery
    }, [areaList, importance, searchQuery, todoList])

    useEffect(() => {}, [filteredList])

    return (
        <AnimatePresence>
            <motion.div
                className="absolute  left-0 top-0  mt-16 flex w-full flex-col md:left-16 md:w-[calc(100%-4rem)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div className="w-full">
                    <input
                        type="text"
                        placeholder="Search by title or description"
                        className="w-full rounded-md border border-gray-600 px-4 py-2 placeholder:font-mont md:w-[calc(100%-4rem)]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex w-full flex-col gap-2 md:flex-row ">
                    <div className="relative mt-4 flex w-full flex-col items-center gap-2 overflow-hidden rounded-xl md:mx-auto md:mt-16 md:w-1/2">
                        <h3 className="font-mont lowercase">Filters</h3>
                        <div className="w-full flex-col  items-center gap-3 lg:w-1/2">
                            <AreaInput
                                title="area of to—do"
                                areaList={areaList}
                                handleAreaList={handleAreaList}
                                areaError={false}
                                setAreaError={() => {}}
                                customStyles=""
                            />

                            <ImportanceInput
                                title="importance"
                                handleImportance={handleImportance}
                                importance={importance}
                                importanceError={false}
                                setImportanceError={() => {}}
                            />
                        </div>
                        <CustomButton
                            customStyles="mt-1 md:mt-4"
                            handleClick={() => {
                                setAreaList(areaCheckbox)
                                setImportance(importanceCheckbox)
                                setSearchQuery('')
                            }}
                        >
                            clear all filters
                        </CustomButton>
                    </div>
                    <div className="relative h-[calc(50vh)] max-h-[calc(100vh-8rem)] min-h-[7rem] w-full overflow-scroll md:h-full md:w-1/2">
                        <div className="h-full w-full p-1 md:p-6">
                            {filteredList.length === 0 && (
                                <div
                                    className={`mb-5 flex h-28 w-full overflow-hidden rounded-md shadow-xl transition hover:brightness-110 md:w-4/5`}
                                >
                                    <div className="flex h-full w-1/3 items-center justify-center bg-gray-600/30">
                                        <img
                                            src={sad}
                                            alt="add to-do icon"
                                            className=" h-10 w-10"
                                        />
                                    </div>
                                    <div className="flex h-full w-2/3 items-center justify-center p-4">
                                        <h3
                                            className={`text-md font-nunito font-bold
                    `}
                                        >
                                            no such to—do
                                        </h3>
                                    </div>
                                </div>
                            )}
                            {filteredList.map((todo) => (
                                <Todo key={todo._id} todo={todo} />
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

export default AllTodoPage
