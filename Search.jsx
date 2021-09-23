// IMPORTS REDACTED
// Handles the logic for grabbing user favorites from a backend API, parsing said data, and displaying it in an intuitive and asthetically pleasing manner.
export const Search = () => {
  const { user } = useContext(UserContext);
  const [organizations, setOrganizations] = useState([]); /* REST API enpoint */
  const [searchData, setSearchData] = useState({
    search: "",
    city: "",
    state: "",
  });
  const [hasSearched, setHasSearched] = useState(false);
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);
  const [userFavorites, setUserFavorites] = useState([]);

  useEffect(() => {
    const getFavorites = async () => {
      const res = await axios.get("/api/favorites", {
        params: {
          userId: user.uid,
        },
      });
      setUserFavorites(res.data);
    };
    getFavorites();

    const getSuggestions = async () => {
      const res = await axios.get("/api/cn/suggestions", {
        params: {
          userId: user.uid,
        },
      });
      setOrganizations(res.data || []);
    };
    getSuggestions();
  }, [user]);

  /* Search */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSearched(true);
    getSearchResults();
  };

  const handleChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value,
    });
  };
  
  const checkFavorited = (ein) => {
    // checks if this ein exists in userfavorites
    for (let i = 0; i < userFavorites.length; i++) {
      if (ein === userFavorites[i].orgId) {
        return userFavorites[i].id;
      }
    }
    return false;
  };

  const generateOrganizations = () => {
    if (organizations.length === 0) {
      return "No Results";
    } else {
      return (
        organizations &&
        organizations.map((org) => {
          return (
            <Organization
              key={org.ein}
              name={org.charityName}
              ein={org.ein}
              isFavorited={checkFavorited(org.ein)}
              organization={org}
            />
          );
        })
      );
    }
  };

  return (
    <Container style={{ paddingTop: 60, paddingBottom: 83 }}>
      <Form onSubmit={handleSubmit} noValidate>
        <Searchbar changeHandler={handleChange} />
        <Form.Check className="mx-auto" type="checkbox">
          <Form.Check.Input
            type="checkbox"
            name="Advanced Search"
            onChange={toggleAdvanced}
          />
          <Form.Check.Label>Advanced Search</Form.Check.Label>
        </Form.Check>
        {isAdvancedSearch && <AdvancedSearchbar changeHandler={handleChange} />}
      </Form>
      {!hasSearched ? <>Recommendations</> : <>Results</>}
      <Row style={{ display: "flex" }}>{generateOrganizations()}</Row>
    </Container>
  );
};