// requiered react native libraries
import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Alert,
  Linking,
  Animated
} from "react-native";
import HTML from "react-native-render-html";
import { Divider, Appbar } from "react-native-paper";
import { Video } from "expo";

// required Redux requiered libraries
import { connect, Provider } from "react-redux";
import { bindActionCreators } from "redux";

// requierd Components
import { getSingleArticle, singleLoadFalser } from "../actions";
import reducers from "../reducers";

class ArticleComponent extends Component {
  widthFixer(str) {
    while (str.search("width") !== -1) {
      str =
        str.slice(0, str.search("width")) + str.slice(str.search("width") + 11);
    }
    return (
      `<div id="main-container" style="direction : rtl">` +
      str.slice(0, str.search("<script>")) +
      `</div>` +
      str.slice(str.search("<script>"))
    );
  }
  addDiv(str) {
    return (
      `<div id="main-container" style="direction : rtl">` +
      str.slice(0, str.search("<script>")) +
      `</div>` +
      str.slice(str.search("<script>"))
    );
  }
  IdSpliter(a) {
    a = a.slice(a.search(".com") + 5);
    return a.slice(0, a.search("-"));
  }
  render() {
    // console.log('you are in articles : ' , this.props);

    const { navigate } = this.props.navigation;
    const content = this.widthFixer(
      this.props.navigation.getParam("content", "Null")
    );

    const title = this.props.navigation.getParam("title", "Null");

    return (
      <Animated.ScrollView>
        <Appbar.Header style={styles.appBar}>
          <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content style={styles.appbarContentStyle} />
        </Appbar.Header>

        <Animated.ScrollView style={styles.container}>
          <View>
            <Text style={styles.header}>{title}</Text>
            <Divider style={styles.divider} />
            <HTML
              html={content}
              imagesMaxWidth={Dimensions.get("window").width}
              baseFontStyle={{
                fontSize: 17,
                lineHeight: 23,
                textAlign: "justify",
                fontFamily: "IRANYekanMobile-Regular"
              }}
              listsPrefixesRenderers={{
                ul: (
                  _htmlAttribs,
                  _children,
                  _convertedCSSStyles,
                  passProps
                ) => <Text />,
                ol: (
                  _htmlAttribs,
                  _children,
                  _convertedCSSStyles,
                  passProps
                ) => <Text />
              }}
              renderers={{
                video: u => (
                  <Video
                    source={{ uri: u.src }}
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    shouldPlay
                    isLooping
                    style={{
                      width: Dimensions.get("window").width,
                      height: (Dimensions.get("window").width * 9) / 16
                    }}
                  />
                )
              }}
              tagsStyles={tagsStyles}
              onLinkPress={async (url, href) => {
                if (href.search("chetor.com") !== -1) {
                  if (
                    (href.search("tag") !== -1) |
                    (href.search("category") !== -1)
                  ) {
                    Linking.openURL(href);
                  } else {
                    let id = this.IdSpliter(href);
                    this.props.singleLoadFalser();
                    await this.props.getSingleArticle(
                      `https://www.chetor.com/wp-json/wp/v2/posts/${id}?_embed&page=1`
                    );
                    this.props.navigation.navigate("Article", {
                      content: this.props.data.singleArticle.content.rendered,
                      title: this.props.data.singleArticle.title.rendered
                    });
                  }
                } else {
                  Linking.openURL(href);
                }
              }}
            />
          </View>
        </Animated.ScrollView>
      </Animated.ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 15,
    marginTop: 15
  },
  header: {
    fontSize: 25,
    fontFamily: "IRANYekanMobile-Bold"
  },
  divider: {
    marginTop: 10
  },
  imgStyle: {
    width: 50,
    height: 50
  },
  appBar: {
    backgroundColor: "#0090B0"
  }
});
const tagsStyles = {
  iframe: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").width / 1.7
  },
  a: { textDecorationLine: "none" },
  h1: { fontFamily: "IRANYekanMobile-Bold", paddingTop: 10 },
  h2: { fontFamily: "IRANYekanMobile-Bold", paddingTop: 10 },
  h3: { fontFamily: "IRANYekanMobile-Bold", paddingTop: 10 },
  h4: { fontFamily: "IRANYekanMobile-Bold", paddingTop: 10 },
  h5: { fontFamily: "IRANYekanMobile-Bold", paddingTop: 10 }
};

function mapStateToProps(state) {
  // console.log('+++ u are' , state);

  return {
    data: state.articles
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getSingleArticle, singleLoadFalser }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ArticleComponent);
