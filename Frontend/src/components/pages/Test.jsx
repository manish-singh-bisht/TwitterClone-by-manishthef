import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function Test() {
    const photos = ["https://source.unsplash.com/random/1200x600", "https://source.unsplash.com/random/900x1000", "https://source.unsplash.com/random/1500x1600"];

    const location = useLocation();

    useEffect(() => {
        if (location.state && location.state.sectionId) {
            const sectionId = location.state.sectionId;
            const section = document.getElementById(sectionId);
            console.log(section);
            if (section) {
                section.scrollIntoView();
            }
        }
    }, [location]);
    return (
        <>
            <div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque, repudiandae dolor temporibus quidem ut harum ipsam magni! Est ut quia, illum facere provident nisi voluptatem qui corrupti quas earum magni laboriosam, autem
                adipisci voluptates dolores! Esse, debitis qui quis veritatis ea sint labore cumque distinctio cum at corrupti ipsa iusto quod quas! Sapiente consequuntur velit officia, iusto architecto cumque sed autem adipisci, animi beatae natus
                pariatur, aliquam ad eveniet! Vitae numquam labore, libero illum reprehenderit quo! Libero odio ex perferendis beatae sint voluptates molestias? Aut, sint inventore. Molestias quasi qui suscipit modi maiores, rem dolorem fugiat magni
                nemo temporibus saepe facilis expedita quod laudantium consequatur animi eligendi ullam sapiente, sint nam excepturi esse iusto recusandae et. Necessitatibus, nostrum blanditiis veniam labore harum vel esse nobis, eos ipsa, quo
                similique consequuntur quisquam natus! Ipsam, ratione hic. Molestias id est doloribus eum, quasi omnis in sapiente cupiditate asperiores, ea, aspernatur adipisci dolores mollitia minus nihil magni distinctio ratione sunt sit pariatur
                enim vitae quisquam laudantium quibusdam. Corporis soluta debitis illum commodi officiis ducimus doloribus, ut facere sit magni quasi quaerat! Consequuntur consectetur reprehenderit animi ab corporis non aliquam molestiae incidunt
                dolores aut harum vero quam asperiores neque cum ratione accusantium accusamus, libero odit maiores. Animi ex totam omnis officia cumque at aliquid tenetur, quod vero neque fugit a asperiores labore ratione nesciunt quia? Omnis eos
                itaque quas, libero dignissimos doloremque officiis saepe hic tempore? Ut, amet consequuntur. Necessitatibus, temporibus ipsum repudiandae numquam eaque incidunt ducimus nostrum. Pariatur iure ab non minima deserunt. Dolorem
                accusantium mollitia blanditiis impedit, amet ipsum ducimus expedita inventore ex architecto soluta unde porro exercitationem laboriosam. Quisquam excepturi voluptatum veniam culpa qui, dicta recusandae et nobis magni ipsum ut
                veritatis corporis asperiores quibusdam minus, labore sed mollitia facilis temporibus cumque modi aliquid. Ut saepe sunt, natus molestiae provident velit.
            </div>
            <div>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ratione expedita beatae quam deserunt tempora. Tempora suscipit aperiam inventore, animi aliquam totam quibusdam odit ex non repudiandae eaque quis sit autem accusamus rerum
                expedita reiciendis nihil magnam eveniet quasi. Dolorem amet consectetur velit id nam, distinctio laboriosam? Ab ratione vitae natus rem at consequatur quis, optio voluptatum, molestiae magni sint officiis aut dolorum inventore, omnis
                dicta porro obcaecati. Incidunt unde laborum architecto delectus! Corrupti, iste perspiciatis repudiandae cupiditate voluptate excepturi dolore tempore, accusantium quae dignissimos labore eius quam perferendis debitis. Doloribus
                quidem placeat dolores maiores aut animi repellendus magnam at ad. Ullam inventore minima saepe impedit rerum illum eos autem odio exercitationem sunt nesciunt quasi sapiente, odit, expedita debitis! Veritatis, ipsam nulla saepe
                explicabo beatae qui tenetur necessitatibus esse dolorum vero dicta velit id ea enim possimus corporis voluptatum. Nulla magni expedita eveniet consequuntur similique corporis temporibus vero, quisquam sint repellat error esse facilis
                quo molestiae. Distinctio consectetur nihil rem ipsum, adipisci, excepturi cumque molestiae corporis deleniti dolores delectus ratione consequatur maiores? Cupiditate perspiciatis a labore similique illum ab enim deleniti eius, minus
                beatae quasi iste quo corporis dolore numquam quibusdam iure amet? Laudantium molestias sed exercitationem tempora odit cum aliquid. A accusamus, aliquid error excepturi eveniet vitae eligendi laboriosam fugiat eos voluptatem, itaque
                quod corporis beatae. Optio vitae dolor unde iste veniam vel similique, harum aperiam odit dignissimos accusantium sapiente illo natus omnis aspernatur ex nobis quidem! Dolor id placeat doloribus nihil amet. Expedita aut sed error
                eaque vel dolores non fuga maiores tempora, rerum obcaecati mollitia quaerat tenetur nulla minima natus labore laboriosam libero corporis, distinctio tempore? Aspernatur nesciunt autem inventore, adipisci, officia reprehenderit neque
                quis in laboriosam quidem ut deserunt voluptate, aperiam maiores natus? Consectetur enim commodi explicabo. Veniam, ad. Soluta rem necessitatibus repellat deleniti consequatur nobis odio aut provident sunt reprehenderit! Quod magni
                fugit quae maxime, tenetur enim incidunt voluptates recusandae eos suscipit veniam totam excepturi. Aperiam quaerat dicta itaque debitis neque corporis aut voluptatum quos voluptate fuga quam at doloribus quasi architecto, dolore
                eveniet perferendis, sit eos eum. Dicta exercitationem et adipisci blanditiis magni. Suscipit temporibus, amet similique, qui dicta eveniet dolorum praesentium ipsam ut sint dignissimos aspernatur placeat consequatur velit. Dicta,
                veniam quas. Repudiandae aperiam, voluptatibus animi, est doloremque repellendus illum natus, ea nesciunt facilis unde. Tenetur libero nihil enim delectus harum, quae debitis, corrupti fugiat quisquam vitae eius aperiam cupiditate
                perspiciatis nostrum repellendus. Cumque autem dolorum libero ex nobis suscipit voluptates? Omnis repellendus delectus eius laboriosam itaque quos laborum dolor ipsam quod. Repellat molestiae molestias minus, in ipsum consequuntur
                quam veritatis similique sint dolorem porro quisquam a accusantium qui cumque, consequatur fuga, voluptatem magni! Soluta consectetur officia at quibusdam, temporibus aperiam repudiandae? Cum quaerat, facilis sint quidem repellendus
                eum dolores, totam in minima voluptate deleniti molestias vel earum suscipit rerum unde sed aliquid enim. Sint quo at, aperiam quod dignissimos, assumenda sit labore, rem porro architecto blanditiis rerum maxime eius obcaecati in
                magnam delectus omnis fuga veniam facilis atque laboriosam! Error, saepe tempora nesciunt perspiciatis hic dicta, eius ex cum delectus voluptatem aspernatur numquam eaque laudantium nemo esse dolore, adipisci illum! Ab porro pariatur
                quidem impedit, veritatis maxime magnam. Maiores, libero unde aperiam commodi eos amet earum ab tenetur repellendus. Obcaecati illum iure cupiditate in corrupti, iusto vitae commodi. Architecto officia amet neque incidunt? Veritatis,
                dolorem ab molestiae dolore recusandae nihil vero non rem voluptas quis distinctio accusamus illum neque numquam, alias nostrum odit illo a. Soluta ducimus atque accusamus officia quasi, neque nesciunt amet mollitia eaque aperiam
                accusantium corporis dolor earum distinctio iure. Ipsa tempore, consequuntur repellat est similique saepe nobis facere consequatur! Repellat reiciendis facere est, consequatur modi voluptates error consectetur. Dolore velit similique
                eos saepe omnis explicabo, ad quia qui dolor incidunt temporibus dolorem. Iste reprehenderit quo voluptatum. Molestiae aliquam minus eligendi ipsa, sed, tenetur asperiores, error impedit sunt totam soluta commodi molestias
                consequuntur iste repellendus? Sint rerum aut sapiente delectus atque id provident numquam ipsa odit nobis sed molestiae, in consequatur, modi deleniti pariatur unde? Consequatur, libero consectetur! Eius deleniti nulla, nam at quo
                rerum? Illo aperiam quis esse voluptates voluptas doloremque recusandae eum fugiat molestiae aliquid assumenda inventore nesciunt necessitatibus laborum ut porro pariatur error, consequatur fuga ducimus possimus. Eaque modi voluptate
                soluta minima aperiam praesentium sunt ab quaerat mollitia fugit iusto architecto repellendus cum dolorum, facere beatae et commodi odit blanditiis ipsam neque, cupiditate doloribus. Mollitia, at consectetur? Nihil earum doloremque
                dolor similique autem asperiores cupiditate, odio alias neque. Unde porro sequi consequatur veritatis hic rerum labore optio voluptas, reiciendis harum eaque obcaecati! Dolor dignissimos magnam similique numquam dolore. Iusto quo, nam
                commodi voluptas eligendi numquam inventore rerum aut officia odit harum dolore explicabo a dicta itaque cum nulla quis modi dolores saepe, tempora aperiam voluptatem. Dignissimos consectetur pariatur, similique error molestiae magnam
                atque nulla optio commodi animi ipsam quaerat qui delectus voluptatibus quas molestias ad obcaecati blanditiis? Quidem totam nisi cupiditate pariatur maxime veritatis nulla, inventore voluptate, praesentium atque nostrum quod aut
                tempora aperiam est. Animi officia error porro recusandae dolorum molestias eum quos aspernatur voluptas quisquam eius velit, laborum numquam nisi cupiditate debitis cum voluptatibus totam, minima corporis. Hic praesentium quaerat,
                molestiae, adipisci amet velit, eveniet nisi beatae eaque inventore ipsa? Quae unde animi perferendis beatae maxime molestiae velit porro magni culpa excepturi officiis dicta, eligendi facere consectetur nulla quos accusantium
                temporibus ratione? Corrupti, natus reiciendis, enim harum nobis quia obcaecati cum impedit ut eligendi, maxime quae! Suscipit fuga reprehenderit voluptatem optio quos, voluptas natus maiores a voluptatum vel rerum ullam, sed nobis
                libero accusamus nemo obcaecati porro in ratione officia illo ducimus exercitationem necessitatibus? A, eum commodi! Similique et, illo consequuntur soluta recusandae fugiat error est fugit. Recusandae dolor incidunt nihil, optio
                aspernatur suscipit explicabo consectetur nemo, accusantium, asperiores ex fuga nisi. Assumenda cum odio quidem. Tempora alias expedita fugiat accusantium cumque, similique dolorem nihil? Aspernatur vel dicta adipisci veritatis
                eligendi mollitia dolore aut harum totam hic, nulla voluptates, similique voluptatum? Aliquid vero recusandae dolorum vel, quisquam suscipit commodi architecto quos nostrum delectus ad beatae.
            </div>
            <div id={`postID`}>hi </div>
        </>
    );
}

export default Test;
