const state = {
    random: {},
    gin: {},
    vodka: {},
    choosenDrink: {},
};

const fetchRandomDrink = () => {
    $.ajax({
        url: 'https://www.thecocktaildb.com/api/json/v1/1/random.php',
    }).done(res => {
        state.random = res;
        const drink = state.random.drinks[0];

        // renders title and instructions for random drink
        $('#random-drink-heading').text(drink.strDrink);
        $('#random-drink-instructions').text(drink.strInstructions);

        // sets the drink image src and alt attribute
        $('#random-drink-image').attr('src', drink.strDrinkThumb);
        $('#random-drink-image').attr('alt', drink.strDrink);

        // get drinks ingredients and returns them as listitems
        const ingredients = getDrinkIngredients(drink);
        const listItems = ingredients.map(({ ingredient, measure }) => {
            return `<li class="modal-recipe-item" tabIndex="0">
                        ${ingredient + ' ' + measure}
                    </li>`;
        });

        $('#ingredient-list').append(listItems);
    });
};

const fetchDrinkById = id => {
    $.ajax({
        url: `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`,
    }).done(res => {
        state.choosenDrink = res;
        const drink = state.choosenDrink.drinks[0];

        const ingredients = getDrinkIngredients(drink);
        const listItems = ingredients.map(({ ingredient, measure }) => {
            return `<li class="modal-recipe-item">
                            ${ingredient + ' ' + measure}
                        </li>`;
        });

        $('#modal-drink-name').text(drink.strDrink);
        $('#modal-recipe-list').append(listItems);
        $('#modal-instructions').text(drink.strInstructions);
    });
};

// since api doesnt returns arrays of ingredients we filter
// and match them with the measurements here
const getDrinkIngredients = drink => {
    const ingredients = Object.keys(drink)
        .map(key => {
            if (key.startsWith('strIngredient')) {
                const ingredient = drink[key] || '';
                const id = key.replace('strIngredient', '');

                const measurementKey = 'strMeasure' + id;
                const measure = drink[measurementKey] || '';

                return { ingredient, measure };
            }
            return null;
        })
        .filter(pair => pair !== null)
        .filter(pair => pair.ingredient !== '');

    return ingredients;
};

const openModal = () => {
    console.log('tja');
    $('#modal').show();
    $('html').css({
        overflow: 'hidden',
        height: '100%',
    });
};

// inits the app
fetchRandomDrink();
$('#drink-category-section').hide();
$('#modal').hide();

$('#random-drink-btn').click(() => {
    fetchRandomDrink();
    $('#random-drink-section').show();
    $('#drink-category-section').hide();
});

$('#gin-drinks-btn').click(() => {
    $.ajax({
        url: 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Gin',
    }).done(res => {
        state.gin = res;

        $('#random-drink-section').hide();
        $('#drink-category-section').fadeIn();
        $('#drink-category-list').empty();

        const drinks = state.gin.drinks.map(drink => {
            const drinkEl = $(
                `<li class="list-item" tabIndex="0">
                    <figure class="figure">
                        <img id="multiple-drink-image" 
                             class="drink-image"
                             src="${drink.strDrinkThumb}">
                        <p class="hover-text">Click to see recipe</p>
                        <figcaption>${drink.strDrink}</figcaption>
                    </figure>
                </li>`
            );

            // adds clickevent to each listitem to trigger the modal
            $(drinkEl).keypress(ev => {
                const key = ev.which;
                if (key === 13 || key === 32) {
                    openModal();
                    fetchDrinkById(drink.idDrink);
                    ev.preventDefault();
                }
            });

            $(drinkEl).click(() => {
                openModal();
                fetchDrinkById(drink.idDrink);
            });

            return drinkEl;
        });

        $('#drink-category-list').append(drinks);
    });
});

$('#vodka-drinks-btn').click(() => {
    $.ajax({
        url: 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Vodka',
    }).done(res => {
        state.vodka = res;

        $('#random-drink-section').hide();
        $('#drink-category-section').fadeIn();
        $('#drink-category-list').empty();

        const drinks = state.vodka.drinks.map(drink => {
            const drinkEl = $(
                `<li class="list-item" tabIndex="0">
                    <figure class="figure">
                        <img id="multiple-drink-image" 
                             class="drink-image" 
                             src="${drink.strDrinkThumb}">
                        <p class="hover-text">Click to see recipe</p>
                        <figcaption>${drink.strDrink}</figcaption>
                    </figure>
                </li>`
            );

            // adds clickevent to each listitem to trigger the modal
            $(drinkEl).keypress(ev => {
                const key = ev.which;
                if (key === 13 || key === 32) {
                    openModal();
                    fetchDrinkById(drink.idDrink);
                    ev.preventDefault();
                }
            });

            $(drinkEl).click(() => {
                openModal();
                fetchDrinkById(drink.idDrink);
            });

            return drinkEl;
        });
        $('#drink-category-list').append(drinks);
    });
});

$('#button--close').click(() => {
    $('#modal').hide();
    $('html').css({
        overflow: 'auto',
        height: '100%',
    });
});
